import React, { useState, useRef, useCallback } from 'react';
import { Flight } from '../../types';
import FlightCard from '../FlightCard/FlightCard';
import Skeleton from '../Skeleton/Skeleton';
import './FlightList.scss';

interface FlightListProps {
  flights: Flight[];
  isLoading: boolean;
  onRefresh: () => void;
}

const FlightList: React.FC<FlightListProps> = ({ flights, isLoading, onRefresh }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPullingRef.current || window.scrollY > 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - startYRef.current;
    
    if (distance > 0) {
      const damping = distance * 0.5;
      setPullDistance(Math.min(damping, 100));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;
    
    if (pullDistance > 50) {
      setIsRefreshing(true);
      onRefresh();
    }
    
    setTimeout(() => {
      setPullDistance(0);
      setIsRefreshing(false);
    }, 500);
  }, [pullDistance, onRefresh]);

  if (isLoading && flights.length === 0) {
    return <Skeleton />;
  }

  if (flights.length === 0 && !isLoading) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✈️</div>
        <div className="empty-text">暂无航班信息</div>
      </div>
    );
  }

  return (
    <div 
      className="flight-list"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div 
          className={`refresh-indicator ${isRefreshing ? 'refreshing' : ''}`}
          style={{ height: `${pullDistance}px` }}
        >
          <div className="refresh-content">
            <div className={`refresh-icon ${isRefreshing ? 'spin' : ''}`}>
              {isRefreshing ? '🔄' : '⬇️'}
            </div>
            <div className="refresh-text">
              {isRefreshing ? '刷新中...' : '下拉刷新'}
            </div>
          </div>
        </div>
      )}
      
      {isLoading && flights.length > 0 && <Skeleton count={3} />}
      
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
};

export default FlightList;
