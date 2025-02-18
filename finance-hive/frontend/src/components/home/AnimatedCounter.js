import { useState, useEffect, useRef } from "react";
import "./AnimatedCounter.css";

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
          observer.disconnect(); // Stop observing once triggered
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      let count = parseInt(localStorage.getItem("visitorCount")) || 0;
      count += 1; // Increase count on each visit
      localStorage.setItem("visitorCount", count);

      setVisitorCount(count);
      setCurrentDigits(count.toString().padStart(4, "0").split("")); // Now ensures 4 digits
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
