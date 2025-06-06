import { useState, useEffect, useRef } from "react";
import "./AnimatedCounter.css";
import config from "../../config";

const AnimatedCounter = () => {
  const [currentDigits, setCurrentDigits] = useState(["0", "0", "0", "0"]);
  const [error, setError] = useState(null);
  const counterRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
      incrementVisitorCount();
    }
  }, [isVisible]);

  const incrementVisitorCount = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/increment-visitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const digits = data.count.toString().padStart(4, "0").split("");
      setCurrentDigits(digits);
      setError(null);
    } catch (err) {
      console.error("Error incrementing visitor count:", err);
      setError("Failed to update visitor count");
    }
  };

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
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default AnimatedCounter;
