import React from 'react';
import './CompletionPage.css'; // Optional for additional styling

const CompletionPage = () => {
  return (
    <div className="completion-page">
      {/* <img
        src="https://static.vecteezy.com/ti/gratis-foton/p1/26794845-en-lycklig-3d-foretag-man-pa-transparent-vit-bakgrund-gratis-fotona.jpg"
        alt="Success"
        className="completion-image"
      /> */}

<video 
  src="/Images/AnimeBg.mp4" 
  autoPlay 
  loop 
  muted 
  className="completion-image"
  style={{
    width: '350px', 
    height: '350px', 
    objectFit: 'cover', 
  }}
>
  Your browser does not support the video tag.
</video>




<h2>Before applying the LOAN, please fill your personal details in the MONEY-MATTERS section that is in the  Sidebar..!! </h2>
      <p>Your Personal Details will be verified at the ORganization within 5 days, now apply for the LOAN by click the APPLY For LOAN in the sidebar..</p>
      <h6>Don`t Delay</h6>
    </div>
  );
};

export default CompletionPage;
