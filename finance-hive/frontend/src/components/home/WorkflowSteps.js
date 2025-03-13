import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Calculator, CreditCard, LineChart, ArrowRight } from 'lucide-react';
import './WorkflowSteps.css';

const WorkflowSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Organizer Registration",
      description: "Financial organizers can register and access our secure platform to manage their lending operations.",
      icon: UserPlus
    },
    {
      title: "User Management",
      description: "Add borrower details including loan amount, interest rate, and tenure. Our system automatically calculates EMIs.",
      icon: Users
    },
    {
      title: "Auto Calculation",
      description: "System generates payment schedule with monthly installments, making it clear and transparent for everyone.",
      icon: Calculator
    },
    {
      title: "Payment Tracking",
      description: "Record and track payments easily. Each payment updates automatically in the system.",
      icon: CreditCard
    },
    {
      title: "User Dashboard",
      description: "Borrowers can login to view their loan status, payment history, and upcoming payments.",
      icon: LineChart
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((current) => (current + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  return (
    <div className="workflow-wrapper">
      <h2 className="workflow-heading">Loan Management Workflow</h2>
      <div className="workflow-slider">
        <div 
          className="workflow-track" 
          // style={{ transform: translateX(-${currentStep * 100}%) }
          
        style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="workflow-step">
                <div className="workflow-card">
                  <div className="workflow-step-header">
                    <div className="workflow-icon-box">
                      <Icon className="workflow-step-icon" />
                    </div>
                    <div className="workflow-step-number">
                      Step {index + 1}
                      <ArrowRight className="workflow-arrow-icon" />
                    </div>
                  </div>
                  <h3 className="workflow-step-title">{step.title}</h3>
                  <p className="workflow-step-description">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="workflow-navigation-dots">
        {steps.map((_, index) => (
          <button
            key={index}
            className={`workflow-dot ${index === currentStep ? 'active' : ''}`}
            onClick={() => goToStep(index)}
          />
        ))}

      </div>

      

      
      {/* <div className="workflow-navigation-dots">

        {steps.map((_, index) => (
          <button
            key={index}
            className={workflow-dot ${index === currentStep ? 'active' : ''}}
            onClick={() => goToStep(index)}
          />
        ))}
      </div> */}
    </div>
  );
};

export default WorkflowSteps;