import React from 'react';
import '../home/InvestmentTimeline.css';
// const timelineData = [
//   {
//     title: "REGISTER",
//     subtitle: "Begin your financial journey",
//     content: {
//       title: "GETTING STARTED WITH REGISTRATION",
//       description: "To begin your financial journey, complete the registration process. This allows you to create an account, access various financial tools, and stay informed about your investments.",
//       steps: [
//         // "Visit the registration page",
//         // "Provide personal details",
//         // "Verify your email address",
//         // "Set up security questions",
//         // "Agree to the terms and conditions",
//         // "Submit your registration"
//       ]
//     }
//   },
//   {
//     title: "LOGIN",
//     subtitle: "Access your financial dashboard",
//     content: {
//       title: "SECURELY LOGGING INTO YOUR ACCOUNT",
//       description: "After registration, log into your account to access your financial dashboard. Here, you can monitor your investments, set goals, and track your progress.",
//       steps: [
//         // "Go to the login page",
//         // "Enter your registered email",
//         // "Input your secure password",
//         // "Complete any two-factor authentication",
//         // "Click on the login button",
//         // "Access your dashboard"
//       ]
//     }
//   },
//   {
//     title: "TRACK FINANCES",
//     subtitle: "Stay on top of your financial goals",
//     content: {
//       title: "MONITORING YOUR FINANCIAL PROGRESS",
//       description: "Regularly track your finance activities to ensure you are on the right path toward achieving your financial goals. Analyze your spending, savings, and investment patterns.",
//       steps: [
//         // "Review your transaction history",
//         // "Analyze spending categories",
//         // "Set monthly financial goals",
//         // "Adjust your budget as needed",
//         // "Evaluate your investment performance",
//         // "Seek advice if necessary"
//       ]
//     }
//   },
//   {
//     title: "LOAN",
//     subtitle: "Explore your borrowing options",
//     content: {
//       title: "UNDERSTANDING LOAN OPTIONS",
//       description: "Before taking out a loan, it's essential to understand your options and the associated risks. Make informed decisions to avoid unnecessary debt.",
//       steps: [
//         // "Determine your borrowing needs",
//         // "Research different loan types",
//         // "Compare interest rates and terms",
//         // "Check your credit score",
//         // "Apply for pre-approval if needed",
//         // "Review loan offers carefully"
//       ]
//     }
//   }
// ];

// const InvestmentTimeline = () => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   return (
//     <div className="investment-timeline">
//       <div className="timeline-header">
//         <div className="timeline-stages">
//           {timelineData.map((item, index) => (
//             <div key={index} className="timeline-stage">
//               <h3 className={`stage-title ${index === activeIndex ? 'highlight' : ''}`}>{item.title}</h3>
//               <p className="stage-subtitle">{item.subtitle}</p>
//             </div>
//           ))}
//         </div>
//         <div className="timeline-line">
//           <div className="timeline-dots">
//             {timelineData.map((_, index) => (
//               <button
//                 key={index}
//                 className={`timeline-dot ${index === activeIndex ? 'active' : ''}`}
//                 onClick={() => setActiveIndex(index)}
//                 aria-label={`Select ${timelineData[index].title} stage`}
//               ></button>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="timeline-content">
//         <h2 className="content-title">{timelineData[activeIndex].content.title}</h2>
//         <p className="content-description">{timelineData[activeIndex].content.description}</p>
//         <ul className="content-steps">
//           {timelineData[activeIndex].content.steps.map((step, index) => (
//             <li key={index} className="step-item">{step}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };


const InvestmentTimeline = () => {
  const steps = [
    {
      number: 1,
      title: "Register",
      description: "To begin your financial journey.",
      className: "investment-circle-1"
    },
    {
      number: 2,
      title: "Login",
      description: "Access your financial dashboard.",
      className: "investment-circle-2"
    },
    {
      number: 3,
      title: "Apply for Loan",
      description: "Apply Now for Your Dream Loan",
      className: "investment-circle-3"
    },
    {
      number: 4,
      title: "Schedule Payments ",
      description: "Stay on Track: Schedule Your Loan Payments",
      className: "investment-circle-4"
    }
  ];

  return (
    <div className="investment-container">
      <div className="investment-timeline">
        {steps.map((step, index) => (
          <div key={index} className="investment-timeline-item">
            <div className={`investment-circle ${step.className}`}>
              <span>{step.number}</span>
            </div>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentTimeline;