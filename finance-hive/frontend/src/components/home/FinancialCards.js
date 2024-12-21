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
import { FaPiggyBank, FaCoins, FaBalanceScale, FaUniversity } from "react-icons/fa";
import { motion } from "framer-motion";
import "./FinancialCards.css";

const FinancialCards = () => {
  const cards = [
    {
      icon: <FaPiggyBank />,
      title: "Savings",
      description: "Manage your savings effectively with our smart tools.",
      color: "#28a745",
    },
    {
      icon: <FaCoins />,
      title: "Investments",
      description: "Explore investment opportunities tailored for you.",
      color: "#007bff",
    },
    {
      icon: <FaBalanceScale />,
      title: "Taxes",
      description: "Get the best tax advice for financial peace of mind.",
      color: "#ffc107",
    },
    {
      icon: <FaUniversity />,
      title: "Loans",
      description: "Flexible loan options that suit your needs.",
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
