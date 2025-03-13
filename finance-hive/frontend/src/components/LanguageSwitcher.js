// LanguageSwitcher.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    setSelectedLanguage(language);
    setShowDropdown(false);
  };

  return (
    <div className="language-switcher">
      <button className="language-btn" onClick={() => setShowDropdown(!showDropdown)}>
        {selectedLanguage === 'en' ? 'English' : selectedLanguage === 'hi' ? 'हिन्दी' : 'తెలుగు'}
      </button>
      {showDropdown && (
        <div className="language-dropdown">
          <button onClick={() => changeLanguage('en')}>English</button>
          <button onClick={() => changeLanguage('hi')}>हिन्दी</button>
          <button onClick={() => changeLanguage('te')}>తెలుగు</button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;