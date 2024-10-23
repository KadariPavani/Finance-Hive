import React, { useState } from "react";
import '../home/TeamGrid.css';
const TeamGrid = () => {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

  const teamMembers = [
    { name: "Person 1", content: "Person 1's content here.", imgSrc: "./Images/Carousel1.png" },
    { name: "Person 2", content: "Person 2's content here.", imgSrc: "./Images/Carousel2.png" },
    { name: "Person 3", content: "Person 3's content here.", imgSrc: "./Images/Carousel3.png" },
    { name: "Person 4", content: "Person 4's content here.", imgSrc: "./Images/Carousel1.png" },
    { name: "Person 5", content: "Person 5's content here.", imgSrc: "./Images/Carousel2.png" },
    { name: "Person 6", content: "Person 6's content here.", imgSrc: "./Images/Carousel3.png" },
    { name: "Person 7", content: "Person 7's content here.", imgSrc: "./Images/Carousel1.png" },
    { name: "Person 8", content: "Person 8's content here.", imgSrc: "./Images/Carousel2.png" },
    { name: "Person 9", content: "Person 9's content here.", imgSrc: "./Images/Carousel3.png" },
  ];

  const handleMouseOver = (index) => {
    setCurrentMemberIndex(index);
  };

  return (
    <div className="team-section">
      <div className="grid-container">
        {teamMembers.map((member, index) => (
          <div
            className="grid-item"
            key={index}
            onMouseOver={() => handleMouseOver(index)}
          >
            <img src={member.imgSrc} alt={member.name} />
          </div>
        ))}
      </div>
      <div className="content-section">
        <p>{teamMembers[currentMemberIndex].content}</p>
        <h3>{teamMembers[currentMemberIndex].name}</h3>
      </div>
      <div className="dots-container">
        {teamMembers.map((_, index) => (
          <div
            key={index}
            className={`dot ${currentMemberIndex === index ? "active" : ""}`}
            onClick={() => handleMouseOver(index)} // Optional: Click to switch to member
          ></div>
        ))}
      </div>
    </div>
  );
};

export default TeamGrid;
