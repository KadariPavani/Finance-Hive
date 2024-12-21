// src/components/HomePage.js
import React from 'react';
import Navbar from './home/Navbar';
import Carousel from './home/Carousel';
import FinancialCards from './home/FinancialCards';
import TitleSection2 from './home/TitleSection2';
import FinancialWizardsSlider from './home/FinancialWizardsSlider';
import InvestmentTimeline from './home/InvestmentTimeline';
import TitleSection3 from './home/TitleSection3';
import TeamGrid from './home/TeamGrid';
import TitleSection4 from './home/TitleSection4';
import GetInTouch from './home/GetInTouch';
import LoginRegisterForm from './home/LoginRegisterForm';
import Footer from './user/Footer';
const HomePage = () => {
  return (
    <>
      <Navbar />
      <Carousel />
      <FinancialCards />
      {/* <TitleSection2 /> */}
      <FinancialWizardsSlider />
      <TitleSection3 />
      <InvestmentTimeline />
      <TitleSection4 />
      <TeamGrid />
      <GetInTouch />
      <LoginRegisterForm />

      <Footer/>
    </>
  );
};

export default HomePage;
