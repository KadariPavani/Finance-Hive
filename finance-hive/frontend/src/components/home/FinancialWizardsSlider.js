// import React, { useState, useEffect } from 'react';
// import '../home/FinancialWizardsSlider.css';

// const FinancialWizardsSlider = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [visibleItems, setVisibleItems] = useState(4); // Default visible items is 4

//   const data = [
//     { title: "Savings Booster", description: "Watch your savings grow with our Savings Booster feature. Whether you’re building an emergency fund or saving for a specific goal, this wizard provides insights on how to maximize your savings.", icon: "fa-landmark" },
//     { title: "Track Transactions", description: "Optimize your financial resources with our advanced asset management tools. Our platform provides users with intuitive features ", icon: "fa-trophy" },
//     { title: "Infrastructure Bonds", description: "These bonds provide a stable investment option with fixed returns, funding essential public infrastructure projects. They offer a lower-risk investment compared to equities.", icon: "fa-university" },
//     { title: "Expense Monitor", description: "Keep a close eye on your spending habits. The Expense Monitor wizard ensures that every transaction is tracked, categorized, and recorded, helping you maintain better financial discipline.", icon: "fa-money-bill" },
//     { title: "Spending Analyzer", description: "Understand your spending patterns with the Spending Analyzer. It breaks down where your money is going each month, helping you identify areas where you can cut back and save more.", icon: "fa-landmark" },
//     { title: "Finance Dashboard", description: "Your entire financial situation at a glance. The Financial Dashboard provides a complete view of your income, expenses, savings, and investments in one place.", icon: "fa-money-bill" },
//   ];

//   const updateVisibleItems = () => {
//     const screenWidth = window.innerWidth;

//     if (screenWidth > 1200) {
//       setVisibleItems(4); // 4 items for large screens
//     } else if (screenWidth > 992) {
//       setVisibleItems(3); // 3 items for medium screens
//     } else if (screenWidth > 768) {
//       setVisibleItems(2); // 2 items for smaller screens
//     } else {
//       setVisibleItems(1); // 1 item for extra small screens
//     }
//   };

//   useEffect(() => {
//     // Set the initial visible items
//     updateVisibleItems();

//     // Add a resize event listener to update the number of visible items when the window is resized
//     window.addEventListener('resize', updateVisibleItems);

//     // Cleanup the event listener on component unmount
//     return () => window.removeEventListener('resize', updateVisibleItems);
//   }, []);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
//   };

//   // Get the visible items for the current index
//   const getVisibleItems = () => {
//     return data.slice(currentIndex, currentIndex + visibleItems).concat(
//       data.slice(0, Math.max(0, (currentIndex + visibleItems) - data.length))
//     );
//   };

//   const visibleData = getVisibleItems();

//   return (
//     <div className="wizard-slider-container">
//       <div className="wizard-slider">
//         <button className="wizard-slider-arrow left" onClick={prevSlide}>
//           &#10094;
//         </button>
//         <div className="wizard-slider-wrapper">
//           {visibleData.map((item, idx) => (
//             <div className="wizard-slider-box" key={idx}>
//               <div className="wizard-icon">
//                 <i className={`fas ${item.icon}`}></i>
//               </div>
//               <h3 className="wizard-title">{item.title}</h3>
//               <div className="wizard-underline"></div>
//               <p className="wizard-description">{item.description}</p>
//             </div>
//           ))}
//         </div>
//         <button className="wizard-slider-arrow right" onClick={nextSlide}>
//           &#10095;
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FinancialWizardsSlider;
import React, { useState, useEffect, useRef } from 'react';
import './FinancialWizardsSlider.css';

const FinancialWizardsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const testimonials = [
    {
      name: "Savings Booster",
      text: "Grow your savings effortlessly. Set goals, track progress, and get insights to maximize your financial potential."
    },
    {
      name: "Track Transactions",
      text: "Easily monitor your expenses. Keep your spending under control with detailed insights and summaries."
    },
    {
      name: "Finance Dashboard",
      text: "View all your finances in one place. Income, expenses, savings, and investments—an overview made simple."
    },
    {
      name: "Spending Analyzer",
      text: "Analyze your spending habits. Identify patterns, reduce unnecessary costs, and save smarter."
    },
  ];

  const updateVisibleItems = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth > 1200) {
      setVisibleItems(3);
    } else if (screenWidth > 768) {
      setVisibleItems(2);
    } else {
      setVisibleItems(1);
    }
  };

  useEffect(() => {
    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);

    // Intersection Observer to trigger animation when the section is visible
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate'); // Trigger animation for the container
        // Ensure the cardRefs are populated and valid
        cardRefs.current.forEach((card, index) => {
          if (card) { // Check if card is valid before accessing
            card.classList.add('animate'); // Trigger animation for each card
          }
        });
      }
    }, { threshold: 0.5 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const getVisibleItems = () => {
    return testimonials.slice(currentIndex, currentIndex + visibleItems).concat(
      testimonials.slice(0, Math.max(0, (currentIndex + visibleItems) - testimonials.length))
    );
  };

  return (
    <div className="financial-wizards-container" ref={containerRef}>
      <div className="financial-wizards-header">
        <h2>Financial Wizards</h2>
        <div className="navigation-arrows">
          <button onClick={prevSlide} className="arrow-btn prev">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={nextSlide} className="arrow-btn next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="financial-wizards-wrapper">
        {getVisibleItems().map((testimonial, index) => (
          <div 
            key={index} 
            className="financial-wizard-card" 
            ref={(el) => {
              // Ensure we are pushing valid DOM elements into cardRefs
              if (el) {
                cardRefs.current[index] = el;
              }
            }}
          >
            <p className="wizard-author">{testimonial.name}</p>
            <p className="wizard-text">{testimonial.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialWizardsSlider;
