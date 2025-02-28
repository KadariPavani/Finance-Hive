import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import Navigation from "../Navigation/Navigation";
import Sidebar from "../sidebar/Sidebar";
import "./UserDashboard.css";
import { FaWallet, FaCalendarAlt, FaChartLine, FaPercent, FaPhone, FaFire, FaClock } from 'react-icons/fa';
import LandingPage from "../home/LandingPage/LandingPage";
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut, Line, PolarArea, Radar } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import moment from 'moment';


const UserDashboard = () => {
    const { t, i18n } = useTranslation();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [nextPayment, setNextPayment] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [analyticsData, setAnalyticsData] = useState({
        paymentStatus: {},
        paymentTimeline: {},
        monthlyPaymentTrends: {},
        principalVsInterest: {},
        completionProgress: {},
        loanUtilization: {},
        paymentHealth: {},
        loanInsights: {}
    });

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const calculateNextPayment = (paymentSchedule) => {
        if (!paymentSchedule || paymentSchedule.length === 0) return null;

        const today = new Date();
        const upcomingPayment = paymentSchedule.find(payment => {
            const paymentDate = new Date(payment.paymentDate);
            return paymentDate > today && payment.status === 'PENDING';
        });

        return upcomingPayment ? { ...upcomingPayment, paymentDate: new Date(upcomingPayment.paymentDate) } : null;
    };

    const prepareAnalyticsData = (paymentSchedule) => {
        // Calculate loan insights from actual payment data
        const calculateLoanInsights = () => {
            const today = moment();
            let currentStreak = 0;
            let bestStreak = 0;
            let tempStreak = 0;
            let earlyPayments = 0;
            let totalDaysEarly = 0;

            // Sort payments by date
            const sortedPayments = [...paymentSchedule].sort((a, b) => 
                moment(a.paymentDate).diff(moment(b.paymentDate))
            );

            // Calculate streaks and early payments
            sortedPayments.forEach(payment => {
                if (payment.status === 'PAID') {
                    const paidDate = moment(payment.paidDate);
                    const dueDate = moment(payment.paymentDate);

                    // Check if paid early
                    if (paidDate.isBefore(dueDate)) {
                        earlyPayments++;
                        totalDaysEarly += dueDate.diff(paidDate, 'days');
                    }

                    // Calculate streaks
                    tempStreak++;
                    bestStreak = Math.max(bestStreak, tempStreak);

                    // Current streak only counts if it's continuous to present
                    if (paidDate.isBefore(today)) {
                        currentStreak = tempStreak;
                    }
                } else {
                    tempStreak = 0;
                }
            });

            // Calculate payment consistency
            const totalDuePayments = sortedPayments.filter(payment => 
                moment(payment.paymentDate).isBefore(today)
            ).length;

            const paidOnTime = sortedPayments.filter(payment => 
                payment.status === 'PAID' && 
                moment(payment.paidDate).isSameOrBefore(moment(payment.paymentDate))
            ).length;

            const consistency = totalDuePayments > 0 
                ? Math.round((paidOnTime / totalDuePayments) * 100) 
                : 100;

            // Determine credit impact based on consistency
            let creditImpact;
            if (consistency >= 90) creditImpact = 'positive';
            else if (consistency >= 75) creditImpact = 'neutral';
            else creditImpact = 'negative';

            return {
                currentStreak,
                bestStreak,
                earlyPayments,
                avgDaysEarly: earlyPayments > 0 ? Math.round(totalDaysEarly / earlyPayments) : 0,
                consistency,
                creditImpact
            };
        };

        const loanInsights = calculateLoanInsights();

        // Payment Status Analytics (Paid, Pending, Overdue)
        const statusCounts = paymentSchedule.reduce((acc, payment) => {
            const today = new Date();
            const paymentDate = new Date(payment.paymentDate);
            let status = payment.status;
            
            // Mark as overdue if payment is pending and date has passed
            if (status === 'PENDING' && paymentDate < today) {
                status = 'OVERDUE';
            }
            
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Monthly Payment Analysis with Status
        const monthlyAnalysis = paymentSchedule.reduce((acc, payment) => {
            const month = new Date(payment.paymentDate).toLocaleString('default', { month: 'short' });
            if (!acc[month]) {
                acc[month] = { PAID: 0, PENDING: 0, OVERDUE: 0 };
            }
            
            const today = new Date();
            const paymentDate = new Date(payment.paymentDate);
            let status = payment.status;
            
            if (status === 'PENDING' && paymentDate < today) {
                status = 'OVERDUE';
            }
            
            acc[month][status] += payment.emiAmount;
            return acc;
        }, {});

        // EMI Breakdown Analysis (New)
        const emiBreakdown = {
            onTime: paymentSchedule.filter(p => p.status === 'PAID' && new Date(p.paidDate) <= new Date(p.paymentDate)).length,
            late: paymentSchedule.filter(p => p.status === 'PAID' && new Date(p.paidDate) > new Date(p.paymentDate)).length,
            missed: paymentSchedule.filter(p => new Date(p.paymentDate) < new Date() && p.status === 'PENDING').length
        };

        // Payment Timeline with actual paid dates
        const timelineData = paymentSchedule
            .filter(payment => payment.paymentDate)
            .map(payment => ({
                scheduledDate: moment(payment.paymentDate).format('YYYY-MM-DD'),
                actualDate: payment.status === 'PAID' ? moment(payment.paidDate).format('YYYY-MM-DD') : null,
                amount: payment.emiAmount,
                status: payment.status
            }));

        // Sort timeline data by scheduled date
        timelineData.sort((a, b) => moment(a.scheduledDate).diff(moment(b.scheduledDate)));

        setAnalyticsData({
            paymentTimeline: {
                labels: timelineData.map(item => moment(item.scheduledDate).format('MMM YYYY')),
                datasets: [
                    {
                        label: t('dashboard.scheduled_payments'),
                        data: timelineData.map(item => ({
                            x: item.scheduledDate,
                            y: item.amount
                        })),
                        borderColor: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: t('dashboard.actual_payments'),
                        data: timelineData
                            .filter(item => item.actualDate)
                            .map(item => ({
                                x: item.actualDate,
                                y: item.amount
                            })),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },

            monthlyTrends: {
                labels: Object.keys(monthlyAnalysis),
                datasets: [
                    {
                        type: 'line',
                        label: t('dashboard.total_amount'),
                        data: Object.values(monthlyAnalysis).map(m => m.PAID + m.PENDING + m.OVERDUE),
                        borderColor: '#6366F1',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        yAxisID: 'y1'
                    },
                    {
                        type: 'bar',
                        label: t('dashboard.paid'),
                        data: Object.values(monthlyAnalysis).map(m => m.PAID),
                        backgroundColor: '#10B981',
                        borderRadius: 6
                    },
                    {
                        type: 'bar',
                        label: t('dashboard.pending'),
                        data: Object.values(monthlyAnalysis).map(m => m.PENDING),
                        backgroundColor: '#F59E0B',
                        borderRadius: 6
                    },
                    {
                        type: 'bar',
                        label: t('dashboard.overdue'),
                        data: Object.values(monthlyAnalysis).map(m => m.OVERDUE),
                        backgroundColor: '#EF4444',
                        borderRadius: 6
                    }
                ]
            },

            paymentStatus: {
                labels: [t('dashboard.paid'), t('dashboard.pending'), t('dashboard.overdue')],
                datasets: [{
                    data: [
                        statusCounts.PAID || 0,
                        statusCounts.PENDING || 0,
                        statusCounts.OVERDUE || 0
                    ],
                    backgroundColor: [
                        '#10B981', // Green for paid
                        '#F59E0B', // Yellow for pending
                        '#EF4444'  // Red for overdue
                    ]
                }]
            },

            completionProgress: {
                percentage: Math.round((statusCounts.PAID || 0) / paymentSchedule.length * 100)
            },

            // paymentHealth: {
            //     onTime: emiBreakdown.onTime,
            //     total: emiBreakdown.onTime + emiBreakdown.late + emiBreakdown.missed,
            //     score: Math.round((emiBreakdown.onTime / (emiBreakdown.onTime + emiBreakdown.late + emiBreakdown.missed)) * 100)
            // },

            loanInsights: {
                currentStreak: loanInsights.currentStreak,
                bestStreak: loanInsights.bestStreak,
                earlyPayments: loanInsights.earlyPayments,
                avgDaysEarly: loanInsights.avgDaysEarly,
                consistency: loanInsights.consistency,
                creditImpact: loanInsights.creditImpact
            }
        });
    };

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/user-details", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userData = response.data.data;
            if (userData.paymentSchedule) {
                userData.paymentSchedule = userData.paymentSchedule.map(payment => ({
                    ...payment,
                    paymentDate: new Date(payment.paymentDate),
                }));
            }

            setUserDetails(userData);
            setNextPayment(calculateNextPayment(userData.paymentSchedule));
            prepareAnalyticsData(userData.paymentSchedule);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user details:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const formatDate = (date) => {
        if (!date) return '';
        try {
            return new Date(date).toLocaleDateString(i18n.language, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid Date';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(i18n.language, {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Navigation userDetails={null} onLogout={handleLogout} toggleSidebar={() => { }} isSidebarOpen={false} />
                <Sidebar userDetails={null} onLogout={handleLogout} isSidebarOpen={false} toggleSidebar={() => { }} />
                <main className="dashboard-main">
                    <div className="user-loading">
                        <div className="user-loading-spinner"></div>
                        <p>{t('dashboard.loading')}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Navigation
                userDetails={userDetails}
                onLogout={handleLogout}
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
            />
            <Sidebar
                userDetails={userDetails}
                onLogout={handleLogout}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <main className="dashboard-main">
                <div className="user-dashboard-container">
                    <div className="user-dashboard-header">
                        {/* <h1>{t('dashboard.overview')}</h1> */}
                        <LandingPage />

                    </div>

                    <div className="stats-container">
                        <div className="stat-card primary">
                            <div className="stat-card-header">
                                <div className="stat-card-icon">
                                    <FaWallet />
                                </div>
                                <h3 className="stat-card-title">{t('dashboard.total_loan')}</h3>
                            </div>
                            <div className="stat-card-value">
                                {formatCurrency(userDetails.amountBorrowed)}
                            </div>
                        </div>

                        <div className="stat-card success">
                            <div className="stat-card-header">
                                <div className="stat-card-icon">
                                    <FaCalendarAlt />
                                </div>
                                <h3 className="stat-card-title">{t('dashboard.next_due')}</h3>
                            </div>
                            <div className="stat-card-value">
                                {nextPayment ? formatDate(nextPayment.paymentDate) : '-'}
                            </div>
                        </div>

                        <div className="stat-card warning">
                            <div className="stat-card-header">
                                <div className="stat-card-icon">
                                    <FaChartLine />
                                </div>
                                <h3 className="stat-card-title">{t('dashboard.remaining_amount')}</h3>
                            </div>
                            <div className="stat-card-value">
                                {formatCurrency(nextPayment ? nextPayment.balance : 0)}
                            </div>
                        </div>

                        <div className="stat-card danger">
                            <div className="stat-card-header">
                                <div className="stat-card-icon">
                                    <FaPercent />
                                </div>
                                <h3 className="stat-card-title">{t('dashboard.interest_rate')}</h3>
                            </div>
                            <div className="stat-card-value">
                                {userDetails.interest}%
                            </div>
                        </div>
                    </div>

                    {userDetails && (
                        <div className="user-content-wrapper">
                            {/* Personal Info Card */}
                            <div className="user-info-card">
                                <div className="user-info-header">
                                    <h2>{t('dashboard.personal_info')}</h2>
                                </div>
                                <div className="user-info-content">
                                    <div className="user-info-item">
                                        <span className="user-info-label">{t('dashboard.name')}</span>
                                        <span className="user-info-value">{userDetails.name}</span>
                                    </div>
                                    <div className="user-info-item">
                                        <span className="user-info-label">{t('dashboard.email')}</span>
                                        <span className="user-info-value">{userDetails.email}</span>
                                    </div>
                                    <div className="user-info-item">
                                        <span className="user-info-label">{t('dashboard.mobile')}</span>
                                        <span className="user-info-value">{userDetails.mobileNumber}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Loan Details Card */}
                            <div className="user-loan-card">
                                <div className="user-loan-header">
                                    <h2>{t('dashboard.loan_details')}</h2>
                                </div>
                                <div className="user-loan-content">
                                    <div className="user-loan-summary">
                                        <div className="user-loan-item">
                                            <span className="user-loan-label">{t('dashboard.amount_borrowed')}</span>
                                            <span className="user-loan-value">
                                                {formatCurrency(userDetails.amountBorrowed)}
                                            </span>
                                        </div>
                                        <div className="user-loan-item">
                                            <span className="user-loan-label">{t('dashboard.tenure')}</span>
                                            <span className="user-loan-value">{userDetails.tenure} {t('dashboard.months')}</span>
                                        </div>
                                        <div className="user-loan-item">
                                            <span className="user-loan-label">{t('dashboard.interest')}</span>
                                            <span className="user-loan-value">{userDetails.interest}%</span>
                                        </div>
                                        {nextPayment && (
                                            <div className="user-loan-item user-next-payment">
                                                <span className="user-loan-label">{t('dashboard.next_payment')}</span>
                                                <span className="user-loan-value">
                                                    {formatCurrency(nextPayment.emiAmount)} {t('common.on')} {formatDate(nextPayment.paymentDate)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Schedule Table */}
                            {userDetails.paymentSchedule && (
                                <div className="user-payment-schedule" id="payments-table">
                                    <h2>{t('dashboard.payment_schedule')}</h2>
                                    <div className="user-table-wrapper">
                                        <table className="user-payment-table">
                                            <thead>
                                                <tr>
                                                    <th>{t('dashboard.sno')}</th>
                                                    <th>{t('dashboard.payment_date')}</th>
                                                    <th>{t('dashboard.paid_date')}</th>
                                                    <th>{t('dashboard.emi_amount')}</th>
                                                    <th>{t('dashboard.principal')}</th>
                                                    <th>{t('dashboard.interest')}</th>
                                                    <th>{t('dashboard.balance')}</th>
                                                    <th>{t('dashboard.status')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userDetails.paymentSchedule.map((payment) => (
                                                    <tr key={payment.serialNo}>
                                                        <td>{payment.serialNo}</td>
                                                        <td>{formatDate(payment.paymentDate)}</td>
                                                        <td>{payment.paidDate ? formatDate(payment.paidDate) : '-'}</td>
                                                        <td>{formatCurrency(payment.emiAmount)}</td>
                                                        <td>{formatCurrency(payment.principal)}</td>
                                                        <td>{formatCurrency(payment.interest)}</td>
                                                        <td>{formatCurrency(payment.balance)}</td>
                                                        <td>{payment.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Analytics Dashboard */}
                    <div className="analytics-dashboard">
                        <div className="analytics-header">
                            <div className="analytics-title-section">
                                <h2 className="analytics-title">{t('dashboard.analytics')}</h2>
                                <p className="analytics-subtitle">{t('dashboard.analytics_subtitle')}</p>
                            </div>
                        </div>

                        <div className="analytics-layout">
                            <div className="analytics-main">
                                <div className="analytics-card timeline-card">
                                    <h3>
                                        <span className="card-title">{t('dashboard.payment_timeline')}</span>
                                        <span className="card-subtitle">{t('dashboard.timeline_subtitle')}</span>
                                    </h3>
                                    <div className="chart-container large">
                                        <Line 
                                            data={analyticsData.paymentTimeline}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                        align: 'end'
                                                    },
                                                    tooltip: {
                                                        mode: 'index',
                                                        intersect: false,
                                                        callbacks: {
                                                            label: (context) => `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`
                                                        }
                                                    }
                                                },
                                                scales: {
                                                    x: {
                                                        type: 'time',
                                                        time: {
                                                            unit: 'month',
                                                            displayFormats: {
                                                                month: 'MMM YYYY'
                                                            }
                                                        },
                                                        grid: { display: false }
                                                    },
                                                    y: {
                                                        beginAtZero: true,
                                                        ticks: {
                                                            callback: value => `₹${value.toLocaleString()}`
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="analytics-secondary">
                                <div className="analytics-card status-card">
                                    <h3>{t('dashboard.payment_status')}</h3>
                                    <div className="status-overview">
                                        {['PAID', 'PENDING', 'OVERDUE'].map(status => (
                                            <div className={`status-item ${status.toLowerCase()}`} key={status}>
                                                <div className="status-count">{analyticsData.paymentStatus.datasets[0].data[['PAID', 'PENDING', 'OVERDUE'].indexOf(status)]}</div>
                                                <div className="status-label">{t(`dashboard.${status.toLowerCase()}`)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="analytics-card progress-card">
                                    <h3>{t('dashboard.completion_progress')}</h3>
                                    <div className="progress-container">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{width: `${analyticsData.completionProgress.percentage}%`}}
                                            />
                                        </div>
                                        <div className="progress-label">
                                            <span className="progress-percentage">{analyticsData.completionProgress.percentage}%</span>
                                            <span className="progress-text">{t('dashboard.completed')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="analytics-bottom">
                                {/* <div className="analytics-card health-card">
                                    <h3>{t('dashboard.payment_health')}</h3>
                                    <div className="health-score">
                                        <div className="score-circle">
                                            <svg viewBox="0 0 36 36">
                                                <path
                                                    d="M18 2.0845
                                                        a 15.9155 15.9155 0 0 1 0 31.831
                                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#E5E7EB"
                                                    strokeWidth="3"
                                                />
                                                <path
                                                    d="M18 2.0845
                                                        a 15.9155 15.9155 0 0 1 0 31.831
                                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke={`${analyticsData.paymentHealth.score > 75 ? '#10B981' : '#F59E0B'}`}
                                                    strokeWidth="3"
                                                    strokeDasharray={`${analyticsData.paymentHealth.score}, 100`}
                                                />
                                            </svg>
                                            <div className="score-value">{analyticsData.paymentHealth.score}</div>
                                        </div>
                                        <div className="score-details">
                                            <div className="score-stat">
                                                <span className="stat-label">{t('dashboard.on_time_payments')}</span>
                                                <span className="stat-value">{analyticsData.paymentHealth.onTime} / {analyticsData.paymentHealth.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                                <div className="analytics-card trends-card">
                                    <h3>{t('dashboard.monthly_trends')}</h3>
                                    <div className="chart-container">
                                        <Bar 
                                            data={analyticsData.monthlyTrends}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                        labels: { usePointStyle: true }
                                                    }
                                                },
                                                scales: {
                                                    x: { stacked: true },
                                                    y: { 
                                                        stacked: true,
                                                        ticks: {
                                                            callback: value => `₹${value}`
                                                        }
                                                    },
                                                    y1: {
                                                        position: 'right',
                                                        grid: { drawOnChartArea: false },
                                                        ticks: {
                                                            callback: value => `₹${value}`
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="analytics-card loan-insights-card">
                                <h3>{t('dashboard.loan_insights')}</h3>
                                <div className="loan-insights">
                                    <div className="insight-metrics">
                                        {/* Payment Streak */}
                                        <div className="insight-metric">
                                            <div className="metric-icon streak">
                                                <FaFire className="icon" />
                                            </div>
                                            <div className="metric-details">
                                                <div className="metric-value">
                                                    {analyticsData.loanInsights.currentStreak}
                                                </div>
                                                <div className="metric-label">
                                                    {t('dashboard.payment_streak')}
                                                </div>
                                                <div className="metric-subtitle">
                                                    {t('dashboard.best_streak')}: {analyticsData.loanInsights.bestStreak}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Early Payments */}
                                        <div className="insight-metric">
                                            <div className="metric-icon early">
                                                <FaClock className="icon" />
                                            </div>
                                            <div className="metric-details">
                                                <div className="metric-value">
                                                    {analyticsData.loanInsights.earlyPayments}
                                                </div>
                                                <div className="metric-label">
                                                    {t('dashboard.early_payments')}
                                                </div>
                                                <div className="metric-subtitle">
                                                    {analyticsData.loanInsights.avgDaysEarly > 0 && 
                                                        `${t('dashboard.avg_days_early')}: ${analyticsData.loanInsights.avgDaysEarly}`
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Consistency */}
                                        <div className="insight-metric">
                                            <div className="metric-icon consistency">
                                                <FaChartLine className="icon" />
                                            </div>
                                            <div className="metric-details">
                                                <div className="metric-value">
                                                    {analyticsData.loanInsights.consistency}%
                                                </div>
                                                <div className="metric-label">
                                                    {t('dashboard.payment_consistency')}
                                                </div>
                                                <div className="metric-subtitle">
                                                    <span className={`impact-badge ${analyticsData.loanInsights.creditImpact}`}>
                                                        {t(`dashboard.credit_${analyticsData.loanInsights.creditImpact}`)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;

