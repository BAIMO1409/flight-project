import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import Header from './components/Header/Header';
import DatePicker from './components/DatePicker/DatePicker';
import FlightList from './components/FlightList/FlightList';
import FilterBar from './components/FilterBar/FilterBar';
import BackToTop from './components/BackToTop/BackToTop';
import { flightStore } from './store/mobx/flightStore';
import { SortType } from './types';
import './App.scss';

const HEADER_HEIGHT = 60;
const DATE_PICKER_HEIGHT = 80;

const App: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(true);
  const [filterBarVisible, setFilterBarVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);

  const flights = flightStore.flights;
  const dateList = flightStore.dateList;
  const selectedDate = flightStore.selectedDate;
  const sortType = flightStore.sortType;
  const isLoading = flightStore.isLoading;

  const handleDateChange = useCallback((date: string) => {
    flightStore.setSelectedDate(date);
  }, []);

  const handleSortChange = useCallback((sort: SortType) => {
    flightStore.setSortType(sort);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      
      if (scrollTop > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      const headerBottom = HEADER_HEIGHT + ((window as any).safeAreaInsets?.top || 0);
      const totalTopHeight = headerBottom + DATE_PICKER_HEIGHT;

      setIsScrolling(true);

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      setDatePickerVisible(false);
      setFilterBarVisible(false);

      const timeout = window.setTimeout(() => {
        setIsScrolling(false);
        setDatePickerVisible(true);
        setFilterBarVisible(true);
      }, 200);
      
      setScrollTimeout(timeout);
      setLastScrollTop(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollTop, scrollTimeout]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Header />
      <DatePicker
        dateList={dateList}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        isVisible={datePickerVisible}
      />

      <div className="list-container">
        <FlightList flights={flights} isLoading={isLoading} />
      </div>

      <FilterBar
        sortType={sortType}
        onSortChange={handleSortChange}
        isVisible={filterBarVisible}
      />

      <BackToTop isVisible={showBackToTop} onClick={handleBackToTop} />
    </div>
  );
};

export default observer(App);
