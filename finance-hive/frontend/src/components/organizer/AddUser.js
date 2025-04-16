//No Use for this code

// import React, { useState } from 'react';
// import axios from 'axios';
// import Modal from '../Modal/Modal';
// import './AddUser.css';

// const AddUser = () => {
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post('https://finance-hive.onrender.com/api/users', formData);
//       setModalMessage('User added successfully!');
//       setIsError(false);
//       setShowModal(true);
//     } catch (error) {
//       setModalMessage('Failed to add user. Please try again.');
//       setIsError(true);
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="add-user-container">
//       <form onSubmit={handleSubmit} className="add-user-form">
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Name"
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Email"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           placeholder="Password"
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Adding...' : 'Add User'}
//         </button>
//       </form>
//       <Modal show={showModal} message={modalMessage} onClose={() => setShowModal(false)} isError={isError} />
//     </div>
//   );
// };

// export default AddUser;


//