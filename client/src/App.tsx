import React, { useState, useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import Header from './components/Header/Header';
import DatePicker from './components/DatePicker/DatePicker';
import FlightList from './components/FlightList/FlightList';
import FilterBar from './components/FilterBar/FilterBar';
import BackToTop from './components/BackToTop/BackToTop';
import { store } from './store/redux/store';
import { useAppSelector, useAppDispatch } from './store/redux/hooks';
import { setSelectedDate, setSortType, loadFlights, initFlightData } from './store/redux/flightSlice';
import { SortType } from './types';
import './App.scss';

const HEADER_HEIGHT = 60;
const DATE_PICKER_HEIGHT = 80;

const FlightApp: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(true);
  const [filterBarVisible, setFilterBarVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const flights = useAppSelector((state) => state.flight.flights);
  const dateList = useAppSelector((state) => state.flight.dateList);
  const selectedDate = useAppSelector((state) => state.flight.selectedDate);
  const sortType = useAppSelector((state) => state.flight.sortType);
  const isLoading = useAppSelector((state) => state.flight.isLoading);

  useEffect(() => {
    dispatch(initFlightData());
  }, [dispatch]);

  const handleDateChange = useCallback((date: string) => {
    dispatch(setSelectedDate(date));
    dispatch(loadFlights({ date, sort: sortType }));
  }, [dispatch, sortType]);

  const handleSortChange = useCallback((sort: SortType) => {
    dispatch(setSortType(sort));
    dispatch(loadFlights({ date: selectedDate, sort }));
  }, [dispatch, selectedDate]);

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

  const handleRefresh = useCallback(() => {
    dispatch(loadFlights({ date: selectedDate, sort: sortType }));
  }, [dispatch, selectedDate, sortType]);

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
        <FlightList flights={flights} isLoading={isLoading} onRefresh={handleRefresh} />
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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <FlightApp />
    </Provider>
  );
};

export default App;
