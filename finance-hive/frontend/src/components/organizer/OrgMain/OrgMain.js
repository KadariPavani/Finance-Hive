import React, { useState } from 'react';
import Sidebar from '../OrgSidebar/Sidebar';
import SummaryCards from '../OrgSummary/OrgSummary';
import LineChartSection from '../OrgLineChart/OrgLineChart';
import DataTableSection from '../OrgDataTable/OrgDataTable';
import PieChartSection from '../OrgPiechart/OrgPiechart';
import UserReports from '../OrgUserReport/OrgUserReport';
import Personaldetails from '../PersonalDetailsDisplay';
import './OrgMain.css';

const OrgMainContent = () => {
  const [activeSection, setActiveSection] = useState('home'); // Default view set to 'home'

  return (
    <div className="orgMainContent">
      <Sidebar setActiveSection={setActiveSection} />
      {activeSection === 'overview' && <SummaryCards />}
      {activeSection === 'lineChart' && <LineChartSection />}
      {activeSection === 'datatable' && <DataTableSection />}
      {activeSection === 'userReports' && <UserReports />}
      {activeSection === 'pieChart' && <PieChartSection />}
      {activeSection === 'personaldetails' && <Personaldetails />}
      {activeSection === 'home' && (
  <div className="homeView">
    <div className='summarylinetable'>
    <SummaryCards />
    <LineChartSection />
    <DataTableSection />
    </div>
    <div className="pieAndReports">
     <UserReports />
      <PieChartSection />
    </div>
  </div>
      )}
    </div>
  );
};

export default OrgMainContent;
