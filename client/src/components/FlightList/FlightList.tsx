import React from 'react';
import { Flight } from '../../types';
import FlightCard from '../FlightCard/FlightCard';
import Skeleton from '../Skeleton/Skeleton';
import './FlightList.scss';

interface FlightListProps {
  flights: Flight[];
  isLoading: boolean;
}

const FlightList: React.FC<FlightListProps> = ({ flights, isLoading }) => {
  if (isLoading) {
    return <Skeleton />;
  }

  if (flights.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✈️</div>
        <div className="empty-text">暂无航班信息</div>
      </div>
    );
  }

  return (
    <div className="flight-list">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
};

export default FlightList;
