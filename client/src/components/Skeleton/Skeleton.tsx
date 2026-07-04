import React from 'react';
import './Skeleton.scss';

interface SkeletonProps {
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }, (_, i) => i + 1).map((item) => (
        <div key={item} className="skeleton-card">
          <div className="skeleton-info">
            <div className="skeleton-time-section">
              <div className="skeleton-time-item">
                <div className="skeleton-time"></div>
                <div className="skeleton-airport"></div>
              </div>
              <div className="skeleton-duration">
                <div className="skeleton-duration-text"></div>
                <div className="skeleton-line"></div>
              </div>
              <div className="skeleton-time-item">
                <div className="skeleton-time"></div>
                <div className="skeleton-airport"></div>
              </div>
            </div>
            <div className="skeleton-detail">
              <div className="skeleton-flight-no"></div>
              <div className="skeleton-airline"></div>
            </div>
          </div>
          <div className="skeleton-price">
            <div className="skeleton-price-amount"></div>
            <div className="skeleton-discount"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
