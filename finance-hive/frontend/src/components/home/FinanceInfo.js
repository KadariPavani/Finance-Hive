import React from "react";
import "./FinanceInfo.css"; // Import the CSS file

document.addEventListener("DOMContentLoaded", function () {
    const textElements = document.querySelectorAll(".fade-in-text");

    textElements.forEach(element => {
        let words = element.textContent.split(" "); // Split text into words
        element.innerHTML = ""; // Clear original text

        words.forEach((word, index) => {
            let span = document.createElement("span");
            span.classList.add("word");
            span.textContent = word + " "; // Add space after word
            span.style.animationDelay = `${index * 0.3}s`; // Delay each word
            element.appendChild(span);
        });
    });
});


const FinanceInfo = () => {
  return (
    <div class="finance-info-container">
        <div class="finance-info-content">
            <h2 class="fade-in-text">Empowering Financial Decisions</h2>
            <p class="fade-in-text">
                Manage your expenses, track investments, and optimize your financial
                growth with our intuitive finance management platform.
            </p>
        </div>
    </div>

  );
};

export default FinanceInfo;
