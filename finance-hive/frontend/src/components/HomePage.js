// src/components/HomePage.js
import React from 'react';
import Navbar from './home/Navbar';
import Carousel from './home/Carousel';
import FinancialCards from './home/FinancialCards';
import FinancialWizardsSlider from './home/FinancialWizardsSlider';
import InvestmentTimeline from './home/InvestmentTimeline';
import TitleSection3 from './home/TitleSection3';
import TeamGrid from './home/TeamGrid';
import TitleSection4 from './home/TitleSection4';
import LoginRegisterForm from './home/LoginRegisterForm';
import Footer from './home/Footer/Footer';
import AnimatedCounter from './home/AnimatedCounter';
import ContactForm from './home/GetInTouch';
import WorkflowSteps from './home/WorkflowSteps';
import RoleSelector from './home/RoleSelector';
const HomePage = () => {
  return (
    <>
      <Navbar />
      <Carousel />
      <FinancialCards />
      <FinancialWizardsSlider />
      <TitleSection3 />
      <InvestmentTimeline />
      <WorkflowSteps />
      <RoleSelector />
      <TitleSection4 />
      <TeamGrid />
      <ContactForm /> 
      <AnimatedCounter/>
      <LoginRegisterForm />
      <Footer />
    </>
  );
};

export default HomePage;
