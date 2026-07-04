import React from 'react';
import { Flight } from '../../types';
import './FlightCard.scss';

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  return (
    <div className="flight-card">
      <div className="flight-info">
        <div className="time-section">
          <div className="time-item">
            <div className="time">{flight.departureTime}</div>
            <div className="airport">{flight.departureAirport}</div>
          </div>
          <div className="duration-section">
            <div className="duration">{flight.duration}</div>
            <div className="route-line">
              <span className="dot"></span>
              <span className="line"></span>
              <span className="dot"></span>
            </div>
          </div>
          <div className="time-item">
            <div className="time">{flight.arrivalTime}</div>
            <div className="airport">{flight.arrivalAirport}</div>
          </div>
        </div>
        
        <div className="flight-detail">
          <div className="flight-no">{flight.flightNo}</div>
          <div className="airline">{flight.airline} {flight.aircraft}</div>
        </div>
      </div>
      
      <div className="price-section">
        <div className="price">
          <span className="currency">¥</span>
          <span className="amount">{flight.price}</span>
        </div>
        <div className="discount">{flight.discount}</div>
        {flight.seats && <div className="seats-tag">{flight.seats}</div>}
      </div>
    </div>
  );
};

export default FlightCard;
