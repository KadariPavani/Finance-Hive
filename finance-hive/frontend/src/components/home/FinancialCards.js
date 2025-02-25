// import React from 'react';
// import '../home/FinancialCards.css';

// const FinancialCards = () => {
//   const cards = [
//     {
//       title: 'ASSET MANAGEMENT',
//       description:
//         'Boost your savings with our comprehensive tracking and budgeting features. Our platform helps users set and achieve savings goals, manage expenditures efficiently, and increase their financial reserves over time.',
//       icon: 'icon-asset-management', // Replace with actual icon class or import
//     },
//     {
//       title: 'TAX SAVINGS',
//       description:
//         'Maximize your savings with our smart tax-saving strategies. Our platform helps users identify and implement effective tax-saving measures, reducing liabilities while maintaining compliance with current regulations.',
//       icon: 'icon-tax-savings', // Replace with actual icon class or import
//     },
//     {
//       title: 'MONEY GROWTH',
//       description:
//         'Achieve significant money growth through our tailored investment options. We offer insights and tools to make informed investment decisions, enhancing your potential for substantial financial returns and wealth accumulation.',
//       icon: 'icon-money-growth', // Replace with actual icon class or import
//     },
//     {
//       title: 'HIGHER SAVINGS',
//       description:
//         'Boost your savings with our comprehensive tracking and budgeting features. Our platform helps users set and achieve savings goals, manage expenditures efficiently, and increase their financial reserves over time.',
//       icon: 'icon-higher-savings', // Replace with actual icon class or import
//     },
//   ];

//   return (
//     <div className="financial-cards-container">
//       <ul className="financial-cards-list">
//         {cards.map((card, index) => (
//           <li key={index} className="financial-card-item">
//             <div className={`financial-card-icon ${card.icon}`}></div>
//             <h3 className="financial-card-title">{card.title}</h3>
//             <p className="financial-card-description">{card.description}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default FinancialCards;
// import React from 'react';
// import '../home/FinancialCards.css';

// const FinancialCards = () => {
//   const cards = [
//     {
//       title: 'ASSET MANAGEMENT',
//       description:
//         'Boost your savings with our comprehensive tracking and budgeting features. Our platform helps users set and achieve savings goals, manage expenditures efficiently, and increase their financial reserves over time.',
//       icon: 'icon-asset-management', // Replace with actual icon class or import
//     },
//     {
//       title: 'TAX SAVINGS',
//       description:
//         'Maximize your savings with our smart tax-saving strategies. Our platform helps users identify and implement effective tax-saving measures, reducing liabilities while maintaining compliance with current regulations.',
//       icon: 'icon-tax-savings', // Replace with actual icon class or import
//     },
//     {
//       title: 'MONEY GROWTH',
//       description:
//         'Achieve significant money growth through our tailored investment options. We offer insights and tools to make informed investment decisions, enhancing your potential for substantial financial returns and wealth accumulation.',
//       icon: 'icon-money-growth', // Replace with actual icon class or import
//     },
//     {
//       title: 'HIGHER SAVINGS',
//       description:
//         'Boost your savings with our comprehensive tracking and budgeting features. Our platform helps users set and achieve savings goals, manage expenditures efficiently, and increase their financial reserves over time.',
//       icon: 'icon-higher-savings', // Replace with actual icon class or import
//     },
//   ];

//   return (
//     <div className="financial-cards-container">
//       <ul className="financial-cards-list">
//         {cards.map((card, index) => (
//           <li key={index} className="financial-card-item">
//             <div className={`financial-card-icon ${card.icon}`}></div>
//             <h3 className="financial-card-title">{card.title}</h3>
//             <p className="financial-card-description">{card.description}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default FinancialCards;
import React from "react";
import { FaPiggyBank, FaUserShield, FaCalculator, FaMoneyCheckAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import "./FinancialCards.css";

const FinancialCards = () => {
  const cards = [
    {
      icon: <FaPiggyBank />,
      title: "Loan Management",
      description: "Efficiently track and manage loan details with automated calculations.",
      color: "#28a745",
    },
    {
      icon: <FaUserShield />,
      title: "User Authentication",
      description: "Securely provide login credentials and personalized dashboards for users.",
      color: "#007bff",
    },
    {
      icon: <FaCalculator />,
      title: "Interest Calculation",
      description: "Automate EMI calculations based on principal, interest rate, and tenure.",
      color: "#ffc107",
    },
    {
      icon: <FaMoneyCheckAlt />,
      title: "Payment Tracking",
      description: "Monitor installments, update payment status, and ensure transparency.",
      color: "#17a2b8",
    },
  ];

  return (
    <section className="financial-cards-container">
      <motion.ul
        className="financial-cards-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {cards.map((card, index) => (
          <motion.li
            key={index}
            className="financial-card-item"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
              type: "spring",
              stiffness: 100,
            }}
          >
            <div
              className="financial-card-icon"
              style={{ backgroundColor: card.color }}
            >
              {card.icon}
            </div>
            <h3 className="financial-card-title">{card.title}</h3>
            <p className="financial-card-description">{card.description}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default FinancialCards;
