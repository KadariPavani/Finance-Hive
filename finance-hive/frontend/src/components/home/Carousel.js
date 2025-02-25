// import React, { useState, useEffect } from 'react';
// import '../home/Carousel.css';

// const Carousel = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const slides = [
    
//     {
//       id: 'slide1',
//       title: 'FINANCE MANAGEMENT',
//       description: 'Manage all your transactions in one place',
//       imageUrl: '/images/Carousel1.png',
//     },
//     {
//       id: 'slide2',
//       title: 'TRACK PAYMENTS',
//       description: 'Effortlessly track all payments for events, canteen, and more',
//       imageUrl: '/images/Carousel2.png',
//     },
//     {
//       id: 'slide3',
//       title: 'SECURE TRANSACTIONS',
//       description: 'Experience a safe and reliable platform for all your financial needs',
//       imageUrl: '/images/Carousel3.png',
//     },
//   ];

//   const nextSlide = () => {
//     setCurrentSlide((currentSlide + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
//   };

//   const setSlide = (index) => {
//     setCurrentSlide(index);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 3000); // Automatically slide every 3 seconds
//     return () => clearInterval(interval); // Cleanup interval on unmount
//   }, [currentSlide]);

//   return (
//     <div className="carousel-container">
//       <div className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>&#10094;</div>

//       {slides.map((slide, index) => (
//         <div
//           key={slide.id}
//           className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
//         >
//           <div className="carousel-overlay"></div>
//           <div
//             className="carousel-slide-background"
//             style={{ backgroundImage: `url(${slide.imageUrl})` }}
//           ></div>
//           <div className="carousel-text-box">
//             <h1>{slide.title}</h1>
//             <p>{slide.description}</p>
//           </div>
//         </div>
//       ))}

//       <div className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>&#10095;</div>

//       <div className="carousel-indicators">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
//             onClick={() => setSlide(index)}
//           ></button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Carousel;

import React, { useState, useEffect } from 'react';
import '../home/Carousel.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typingText, setTypingText] = useState('');

  const slides = [
    {
      id: 'slide1',
      title: 'FINANCE MANAGEMENT',
      description: 'Manage all your transactions in one place',
    },
    {
      id: 'slide2',
      title: 'TRACK PAYMENTS',
      description: 'Effortlessly track all payments for events, canteen, and more',
    },
    {
      id: 'slide3',
      title: 'SECURE TRANSACTIONS',
      description: 'Experience a safe and reliable platform for all your financial needs',
    },
  ];

  const setSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 7000); // Automatically slide every 7 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    let currentText = '';
    let currentIndex = 0;
    const text = slides[currentSlide].description;
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setTypingText(currentText);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Typing speed (50ms per character)

    return () => clearInterval(typingInterval);
  }, [currentSlide]);

  return (
    <div className="carousel-container">
      {/* Static Background Image */}
      <div
        className="carousel-background-image"
        style={{ backgroundImage: `url('/Images/MainBgNOTxt.jpg')` }}
      ></div>

      {/* Text Box with Sliding Text */}
      <div className="carousel-text-box-container">
        <h1 className="carousel-title">{slides[currentSlide].title}</h1>
        <p className="carousel-description">{typingText}</p>
      </div>

      {/* Indicators */}
      <div className="carousel-indicators-container">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator-button ${index === currentSlide ? 'active-indicator' : ''}`}
            onClick={() => setSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
