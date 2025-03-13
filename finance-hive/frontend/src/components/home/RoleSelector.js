import React, { useState } from 'react';
import { UserCircle, Building2, Users } from 'lucide-react';
import './RoleSelector.css';

const RoleSelector = () => {
  const [activeRole, setActiveRole] = useState('admin');

  const roleContent = {
    admin: {
      title: "Admin Roles & Responsibilities",
      description: "As an administrator, you'll have access to:",
      points: [
        "Manages the overall system and settings",
        " Creates and assigns roles to Organizers",
        "Monitors and resolves any system issues",
        "Has access to all data and features"
      ]
    },
    user: {
      title: "User Roles & Responsibilities",
      description: "As a user, you can:",
      points: [
        "Logs in to view their dashboard and transaction history",
        "Checks payment status and upcoming payment schedules",
        "Updates their profile and contact information",
        "Receives reminders and notifications for upcoming payments",
        " Has limited access to their own data and transaction history"
      ]
    },
    organizer: {
      title: "Organizer Roles & Responsibilities",
      description: "As an organizer, you'll be able to:",
      points: [
        "Manages user accounts and transactions",
        "Enters details of loans, interest rates, and payment schedules",
        "Updates payment status and tracks user payments",
        "Receives reminders and notifications for upcoming payments",
        "Has access to user data and transaction history"
      ]
    }
  };

  return (
    <div className="role-container">
      <div className="role-card">
        {/* Role Selector Buttons */}
        <div className="button-container">
          <button
            onClick={() => setActiveRole('admin')}
            className={`role-button ${activeRole === 'admin' ? 'active' : 'inactive'}`}
          >
            <Building2 />
            Admin
          </button>
          
          <button
            onClick={() => setActiveRole('user')}
            className={`role-button ${activeRole === 'user' ? 'active' : 'inactive'}`}
          >
            <UserCircle />
            User
          </button>
          
          <button
            onClick={() => setActiveRole('organizer')}
            className={`role-button ${activeRole === 'organizer' ? 'active' : 'inactive'}`}
          >
            <Users />
            Organizer
          </button>
        </div>

        {/* Content Section */}
        <div className="content-section">
          <h2 className="content-title">
            {roleContent[activeRole].title}
          </h2>
          <p className="content-description">
            {roleContent[activeRole].description}
          </p>
          <ul className="points-list">
            {roleContent[activeRole].points.map((point, index) => (
              <li key={index} className="point-item">
                <div className="point-bullet" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
//     <div className="role-container">
//       <div className="role-card">
//         {/* Role Selector Buttons */}
//         <div className="button-container">
//           <button
//             onClick={() => setActiveRole('admin')}
//             className={role-button ${activeRole === 'admin' ? 'active' : 'inactive'}}
//           >
//             <Building2 />
//             Admin
//           </button>
          
//           <button
//             onClick={() => setActiveRole('user')}
//             className={role-button ${activeRole === 'user' ? 'active' : 'inactive'}}
//           >
//             <UserCircle />
//             User
//           </button>
          
//           <button
//             onClick={() => setActiveRole('organizer')}
//             className={role-button ${activeRole === 'organizer' ? 'active' : 'inactive'}}
//           >
//             <Users />
//             Organizer
//           </button>
//         </div>

//         {/* Content Section */}
//         <div className="content-section">
//           <h2 className="content-title">
//             {roleContent[activeRole].title}
//           </h2>
//           <p className="content-description">
//             {roleContent[activeRole].description}
//           </p>
//           <ul className="points-list">
//             {roleContent[activeRole].points.map((point, index) => (
//               <li key={index} className="point-item">
//                 <div className="point-bullet" />
//                 {point}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleSelector;