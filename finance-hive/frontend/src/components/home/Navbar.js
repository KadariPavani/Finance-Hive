import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../home/Navbar.css';

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1118);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1118);
      if (window.innerWidth >= 1118) {
        setMenuVisible(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoginRegisterClick = () => {
    navigate('/login'); // Navigate to the Login/Register route
  };

  return (
    <>
      <header className="header">
        <nav className="nav container">
          <div className="nav__data">
            <Link to="/" className="nav__logo">
              <img src="../Images/FinanceHiveLogoFinal.png" alt="FMS Logo" />
            </Link>
            <div className="nav__toggle" onClick={toggleMenu}>
              <i
                className={`ri-menu-line nav__toggle-menu ${
                  menuVisible ? 'show-icon' : ''
                }`}
              ></i>
              <i
                className={`ri-close-line nav__toggle-close ${
                  menuVisible ? '' : 'show-icon'
                }`}
              ></i>
            </div>

            <div
              className={`nav__menu ${
                menuVisible || !isMobile ? 'show-menu' : ''
              }`}
            >
              <ul className="nav__list">
                <li>
                  <Link to="/" className="nav__link">
                    Home
                  </Link>
                </li>

                <DropdownItem
                  title="About FMS"
                  index={1}
                  activeDropdown={activeDropdown}
                  toggleDropdown={toggleDropdown}
                  isMobile={isMobile}
                >
                  <DropdownGroup title="SERVICES" icon="ri-service-line">
                    <DropdownLink to="#" label="Asset Management" />
                    <DropdownLink to="#" label="Tax Savings" />
                    <DropdownLink to="#" label="Money Growth" />
                    <DropdownLink to="#" label="Higher Savings" />
                  </DropdownGroup>

                  <DropdownGroup title="FINANCIAL WIZARDS" icon="ri-bank-line">
                    <DropdownLink
                      to="#"
                      label="Loans Directly from Organization"
                    />
                    <DropdownLink to="#" label="Payment scheduled by own" />
                    <DropdownLink to="#" label="User Friendly" />
                  </DropdownGroup>

                  <DropdownGroup
                    title="GETTING STARTED WITH FMS"
                    icon="ri-book-mark-line"
                  >
                    <DropdownLink to="/register" label="Register" />
                    <DropdownLink to="/login" label="Login" />
                    <DropdownLink to="#" label="Track Finances" />
                    <DropdownLink to="#" label="Take Loan" />
                  </DropdownGroup>

                  <DropdownGroup title="SAFETY & QUALITY" icon="ri-shield-line">
                    <DropdownLink to="#" label="Cookie settings" />
                    <DropdownLink to="#" label="Privacy Policy" />
                  </DropdownGroup>
                </DropdownItem>

                <li>
                  <Link to="/contact" className="nav__link">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="nav__link">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

// DropdownItem component
const DropdownItem = ({
  title,
  index,
  activeDropdown,
  toggleDropdown,
  isMobile,
  children,
}) => (
  <li
    className={`dropdown__item ${
      activeDropdown === index ? 'show-dropdown' : ''
    }`}
    onClick={() => toggleDropdown(index)}
  >
    <div className="nav__link dropdown__button">
      {title} <i className="ri-arrow-down-s-line dropdown__arrow"></i>
    </div>
    <div
      className="dropdown__container"
      style={{ height: activeDropdown === index && isMobile ? 'auto' : '' }}
    >
      <div className="dropdown__content">{children}</div>
    </div>
  </li>
);

// DropdownGroup component
const DropdownGroup = ({ title, icon, children }) => (
  <div className="dropdown__group">
    <div className="dropdown__icon">
      <i className={icon}></i>
    </div>
    <span className="dropdown__title">{title}</span>
    <ul className="dropdown__list">{children}</ul>
  </div>
);

// DropdownLink component
const DropdownLink = ({ to, label }) => (
  <li>
    <Link to={to} className="dropdown__link">
      {label}
    </Link>
  </li>
);

export default Navbar;
