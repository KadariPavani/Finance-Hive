import { useState, useEffect, useRef } from "react";
import "./AnimatedCounter.css";

const API_URL = "http://localhost:5000/api"; // Replace with deployed API URL when hosted

const AnimatedCounter = () => {
  const [currentDigits, setCurrentDigits] = useState([]);
  const counterRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      fetch(`${API_URL}/increment-visitor`, { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
          setVisitorCount(data.count);
          setCurrentDigits(data.count.toString().padStart(4, "0").split(""));
        })
        .catch((error) => console.error("Error fetching visitor count:", error));
    }
  }, [isVisible]);

  return (
    <div ref={counterRef} className="counter-container">
      <div className="total-visitors-box">
        <h2>Total Visitors:</h2>
        <div className="counter-display">
          {currentDigits.map((num, index) => (
            <div key={index} className="counter-digit">
              <span className="rolling">{num}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedCounter;
