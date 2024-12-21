// import React, { useState } from 'react';
// import './GetInTouch.css';

// const ContactForm = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     message: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <div className="contact-container">
//       <h1>Contact us</h1>
//       <p className="contact-description">
//         Need to get in touch with us? Either fill out the form with your inquiry or
//         find the <span className="department-link">department email</span> you'd like to contact below.
//       </p>
      
//       <form onSubmit={handleSubmit} className="contact-form">
//         <div className="name-group">
//           <div className="form-group">
//             <input
//               type="text"
//               name="firstName"
//               placeholder="First name*"
//               required
//               value={formData.firstName}
//               onChange={handleChange}
//               className="form-input"
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="text"
//               name="lastName"
//               placeholder="Last name"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="form-input"
//             />
//           </div>
//         </div>
        
//         <div className="form-group">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email*"
//             required
//             value={formData.email}
//             onChange={handleChange}
//             className="form-input"
//           />
//         </div>
        
//         <div className="form-group">
//           <textarea
//             name="message"
//             placeholder="What can we help you with?"
//             value={formData.message}
//             onChange={handleChange}
//             className="form-textarea"
//           />
//         </div>
        
//         <button type="submit" className="submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };
// // const ContactForm = () => {
// //   const [formData, setFormData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     email: '',
// //     organization: '',
// //     location: '',
// //     phoneNumber: '',
// //     message: '',
// //   });

// //   const organizations = [
// //     'KIET GROUP',
// //     'K-HUB',
// //     'IIIT-H',
// //   ];

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prevData) => ({
// //       ...prevData,
// //       [name]: value,
// //     }));
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log('Form Submitted:', formData);
// //   };

// //   return (
// //     <div className="contact-main-div">
// //       <div className="contact-left-div">
// //           <form onSubmit={handleSubmit}>
// //           <div className="contact-input-group">
// //             <input
// //               type="text"
// //               name="lastName"
// //               placeholder="Last Name"
// //               value={formData.lastName}
// //               onChange={handleChange}
// //               className="contact-input"
// //             />
// //             <input
// //               type="text"
// //               name="firstName"
// //               placeholder="First Name"
// //               value={formData.firstName}
// //               onChange={handleChange}
// //               className="contact-input"
// //             />
// //           </div>
// //           <input
// //             type="email"
// //             name="email"
// //             placeholder="Email"
// //             value={formData.email}
// //             onChange={handleChange}
// //             className="contact-input"
// //           />
// //           <select
// //             name="organization"
// //             value={formData.organization}
// //             onChange={handleChange}
// //             className="contact-select"
// //           >
// //             <option value="">Select Organization</option>
// //             {organizations.map((org, index) => (
// //               <option key={index} value={org}>
// //                 {org}
// //               </option>
// //             ))}
// //           </select>
// //           <input
// //             type="text"
// //             name="location"
// //             placeholder="Location"
// //             value={formData.location}
// //             onChange={handleChange}
// //             className="contact-input"
// //           />
// //           <input
// //             type="tel"
// //             name="phoneNumber"
// //             placeholder="Phone Number"
// //             value={formData.phoneNumber}
// //             onChange={handleChange}
// //             className="contact-input"
// //           />
// //           <textarea
// //             name="message"
// //             placeholder="Message"
// //             value={formData.message}
// //             onChange={handleChange}
// //             className="contact-textarea"
// //           ></textarea>
// //           <button type="submit" className="contact-button">Send</button>
// //         </form>
// //       </div>
// //       <div className="contact-right-div">
// //         <img
// //           src="https://img.freepik.com/free-photo/business-woman-working_1303-5972.jpg?ga=GA1.1.2051335758.1728988912&semt=ais_hybrid"
// //           alt="Contact Us"
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// export default ContactForm;import React, { useState } from "react";
import "./GetInTouch.css";
import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="contact-container">
      {/* Contact Form Section */}
      <div className="contact-form-container">
        <h1>Contact Us</h1>
        <p className="contact-description">
          Got questions or need assistance? Fill out the form, and our team will
          get back to you shortly.
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="name-group">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                placeholder="First name*"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email*"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              placeholder="What can we help you with?"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>

      {/* Map Section */}
      <div className="contact-map-container">
        <iframe
          title="Location Map"
          className="contact-map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.015607199199!2d144.9537363153542!3d-37.81632644202171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577e489ab0f0b9b!2sMelbourne!5e0!3m2!1sen!2sau!4v1672114560924!5m2!1sen!2sau"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactForm;
