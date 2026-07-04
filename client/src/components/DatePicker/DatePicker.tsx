import React, { useRef } from 'react';
import { DateItem } from '../../types';
import './DatePicker.scss';

interface DatePickerProps {
  dateList: DateItem[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  isVisible: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ dateList, selectedDate, onDateChange, isVisible }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDateClick = (date: string, element: HTMLDivElement) => {
    onDateChange(date);
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <div className={`date-picker ${isVisible ? 'visible' : ''}`}>
      <div className="date-scroll" ref={scrollRef}>
        <div className="date-list">
          {dateList.map((item) => (
            <div
              key={item.date}
              className={`date-item ${selectedDate === item.date ? 'selected' : ''}`}
              onClick={(e) => handleDateClick(item.date, e.currentTarget)}
            >
              <div className="date-week">{item.week}</div>
              <div className="date-day">{item.date.split('-')[2]}</div>
              <div className="date-price">¥{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
