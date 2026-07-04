import React from 'react';
import './Header.scss';

const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="route">
          <div className="route-item">
            <span className="city">北京</span>
            <span className="city-code">PEK</span>
          </div>
          <div className="arrow">→</div>
          <div className="route-item">
            <span className="city">上海</span>
            <span className="city-code">SHA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
