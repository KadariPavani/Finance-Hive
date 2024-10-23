import React from 'react';
import '../home/FinancialCards.css';

const FinancialCards = () => {
  const cards = [
    {
      title: 'ASSET MANAGEMENT',
      description:
        'Boost your savings with our comprehensive tracking and budgeting features. Our platform helps users set and achieve savings goals, manage expenditures efficiently, and increase their financial reserves over time.',
      icon: 'icon-asset-management', // Replace with actual icon class or import
    },
    {
      title: 'TAX SAVINGS',
      description:
        'Maximize your savings with our smart tax-saving strategies. Our platform helps users identify and implement effective tax-saving measures, reducing liabilities while maintaining compliance with current regulations.',
      icon: 'icon-tax-savings', // Replace with actual icon class or import
    },
    {
      title: 'MONEY GROWTH',
      description:
        'Achieve significant money growth through our tailored investment options. We offer insights and tools to make informed investment decisions, enhancing your potential for substantial financial returns and wealth accumulation.',
      icon: 'icon-money-growth', // Replace with actual icon class or import
    },
    {
      title: 'HIGHER SAVINGS',
      description:
        'Boost your savings with our comprehensive tracking and budgeting features. Our platform helps users set and achieve savings goals, manage expenditures efficiently, and increase their financial reserves over time.',
      icon: 'icon-higher-savings', // Replace with actual icon class or import
    },
  ];

  return (
    <div className="financial-cards-container">
      <ul className="financial-cards-list">
        {cards.map((card, index) => (
          <li key={index} className="financial-card-item">
            <div className={`financial-card-icon ${card.icon}`}></div>
            <h3 className="financial-card-title">{card.title}</h3>
            <p className="financial-card-description">{card.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialCards;
