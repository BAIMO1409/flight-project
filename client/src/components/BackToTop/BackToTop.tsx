import React from 'react';
import './BackToTop.scss';

interface BackToTopProps {
  isVisible: boolean;
  onClick: () => void;
}

const BackToTop: React.FC<BackToTopProps> = ({ isVisible, onClick }) => {
  return (
    <button
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={onClick}
    >
      ↑
    </button>
  );
};

export default BackToTop;
