import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    getYear,
    setYear,
    addYears,
    subYears
} from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader } from 'lucide-react';
import './Calendar.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [monthData, setMonthData] = useState({});
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Fetch data for the entire month
    const fetchMonthData = async (date) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/organizer/month-analytics/${format(date, 'yyyy-MM')}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMonthData(response.data);
        } catch (error) {
            console.error('Error fetching month data:', error);
        }
    };

    // Fetch data for a specific day
    const fetchDayData = async (date) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/organizer/day-analytics/${format(date, 'yyyy-MM-dd')}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setPaymentData(response.data);
        } catch (error) {
            console.error('Error fetching day data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonthData(currentDate);
    }, [currentDate]);

    const handleDateClick = (date) => {
        setSelectedDate(date);
        fetchDayData(date);
    };

    const handlePreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const handlePreviousYear = () => {
        setCurrentDate(subYears(currentDate, 1));
    };

    const handleNextYear = () => {
        setCurrentDate(addYears(currentDate, 1));
    };

    const getDaysInMonth = () => {
        // Get the first day of the current month's grid
        const start = startOfWeek(startOfMonth(currentDate));
        // Get the last day of the current month's grid
        const end = endOfWeek(endOfMonth(currentDate));
        // Get all days in between
        const days = eachDayOfInterval({ start, end });
        return days;
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getFilteredPayments = (payments) => {
        if (!payments || statusFilter === 'ALL') return payments;
        return payments.filter(payment => payment.status === statusFilter);
    };
    const renderDayContent = (day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayData = monthData[dateKey] || {};
        const hasPayments = dayData.totalPayments > 0;
        const isCurrentMonth = isSameMonth(day, currentDate);

        let statusClass = '';
        if (dayData.paidCount > 0) statusClass += ' has-paid';
        if (dayData.pendingCount > 0) statusClass += ' has-pending';

        return (
            <div 
                className={`calendar-day ${
                    !isCurrentMonth ? 'different-month' : ''
                } ${isSameDay(day, selectedDate) ? 'selected' : ''} ${
                    hasPayments ? 'has-payments' : ''
                } ${statusClass}`}
                onClick={() => handleDateClick(day)}
            >
                <span className="day-number">{format(day, 'd')}</span>
                {hasPayments && (
                    <div className="day-summary">
                        {dayData.paidCount > 0 && (
                            <span className="paid-count">✓ {dayData.paidCount}</span>
                        )}
                        {dayData.pendingCount > 0 && (
                            <span className="pending-count">• {dayData.pendingCount}</span>
                        )}
                    </div>
                )}
            </div>
        );
    };

    
    return (
        <div className="calendar-page">
            <div className="calendar-container">
                <div className="calendar-header">
                    <div className="calendar-navigation">
                        <button onClick={handlePreviousYear} className="nav-button" title="Previous Year">
                            <ChevronsLeft />
                        </button>
                        <button onClick={handlePreviousMonth} className="nav-button" title="Previous Month">
                            <ChevronLeft />
                        </button>
                    </div>
                    <h2>{format(currentDate, 'MMMM yyyy')}</h2>
                    <div className="calendar-navigation">
                        <button onClick={handleNextMonth} className="nav-button" title="Next Month">
                            <ChevronRight />
                        </button>
                        <button onClick={handleNextYear} className="nav-button" title="Next Year">
                            <ChevronsRight />
                        </button>
                    </div>
                </div>

                <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                    {getDaysInMonth().map((day, index) => (
                        <React.Fragment key={index}>
                            {renderDayContent(day)}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {selectedDate && (
                <div className="day-analytics">
                    <h3>Analytics for {format(selectedDate, 'dd MMMM yyyy')}</h3>
                    
                    <div className="filter-container">
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="status-filter"
                        >
                            <option value="ALL">All Payments</option>
                            <option value="PAID">Paid</option>
                            <option value="PENDING">Pending</option>
                            <option value="OVERDUE">Overdue</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="loading">
                            <Loader className="spinner" />
                            Loading...
                        </div>
                    ) : paymentData ? (
                        <>
                            <div className="analytics-grid">
                                <div className="analytics-card">
                                    <h4>Collections</h4>
                                    <p className="amount">
                                        {formatCurrency(paymentData.totalCollections)}
                                    </p>
                                    <small>{paymentData.paidCount} payments</small>
                                </div>
                                <div className="analytics-card">
                                    <h4>Pending</h4>
                                    <p className="amount">
                                        {formatCurrency(paymentData.totalPending)}
                                    </p>
                                    <small>{paymentData.pendingCount} payments</small>
                                </div>
                                <div className="analytics-card">
                                    <h4>Net Profit</h4>
                                    <p className="amount">
                                        {formatCurrency(paymentData.netProfit)}
                                    </p>
                                </div>
                            </div>

                            {paymentData.payments && (
                                <div className="payments-list">
                                    <h4>Payment Details</h4>
                                    <div className="table-container">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>User</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getFilteredPayments(paymentData.payments).map((payment, index) => (
                                                    <tr key={index}>
                                                        <td>{payment.userName}</td>
                                                        <td>{formatCurrency(payment.amount)}</td>
                                                        <td>
                                                            <span className={`status ${payment.status.toLowerCase()}`}>
                                                                {payment.status}
                                                            </span>
                                                        </td>
                                                        <td>{format(new Date(payment.time), 'HH:mm')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-data">Select a date to view analytics</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Calendar;