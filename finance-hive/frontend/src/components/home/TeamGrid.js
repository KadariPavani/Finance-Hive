import React, { useState } from "react";
import '../home/TeamGrid.css';
const TeamGrid = () => {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

  const teamMembers = [
    { name: "Namala Monika", content: "Team Lead", imgSrc: "/Images/Monika.jpg" },
    { name: "Pavani Kadari", content: "Junior Developer", imgSrc: "/Images/pannu.jpg" },
    { name: "Yogitha Yadla", content: "Senior Developer", imgSrc: "/Images/yogitha.jpg" },
    { name: "Jothsna Pandranki", content: "Junior Developer", imgSrc: "Images/joo.jpg" },
    { name: "Pavani Borusu", content: "Senior Developer", imgSrc: "/Images/Pavani.jpg" },
    { name: "Ramya", content: "Senior Developer", imgSrc: "Images/Ramya.jpg" },
    { name: "Subrahmanyam Penujuli", content: "Senior Developer", imgSrc: "/Images/Subrahmanyam.jpg" },
    { name: "Sai Varshitha", content: "Junior Developer", imgSrc: "/Images/varshi.jpg" },
    { name: "Priyanka Mullu", content: "Junior Developer", imgSrc: "/Images/Priyanka.jpg" },
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
