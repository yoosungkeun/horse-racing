
import React from 'react';
import type { Language } from '../translations';

interface LanguageSwitcherProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage }) => {
  const isKorean = language === 'ko';

  const toggleLanguage = () => {
    setLanguage(isKorean ? 'en' : 'ko');
  };

  return (
    <div
      onClick={toggleLanguage}
      className="relative w-20 h-9 bg-gray-700 rounded-full cursor-pointer flex items-center px-1 shadow-inner select-none"
      role="switch"
      aria-checked={isKorean}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleLanguage(); }}
      aria-label="Language switch"
    >
      <div
        className={`absolute top-1 left-1 w-7 h-7 bg-yellow-400 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isKorean ? 'translate-x-10' : 'translate-x-0'
        }`}
      ></div>
      <div className="w-full flex justify-between items-center px-1">
        <span className={`text-sm font-bold ${!isKorean ? 'text-white' : 'text-gray-400'}`}>EN</span>
        <span className={`text-sm font-bold ${isKorean ? 'text-white' : 'text-gray-400'}`}>KR</span>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
