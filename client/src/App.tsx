import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header/Header';
import DatePicker from './components/DatePicker/DatePicker';
import FlightList from './components/FlightList/FlightList';
import FilterBar from './components/FilterBar/FilterBar';
import BackToTop from './components/BackToTop/BackToTop';
import { flightStore } from './store/mobx/flightStore';
import { store as reduxStore, loadFlightsAsync, AppDispatch } from './store/redux/store';
import { ReduxState } from './store/redux/types';
import { SortType } from './types';
import './App.scss';

const App: React.FC = () => {
  const [useMobx, setUseMobx] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [filterBarVisible, setFilterBarVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const reduxState = useSelector((state: ReduxState) => state);

  const flights = useMobx ? flightStore.flights : reduxState.flights;
  const dateList = useMobx ? flightStore.dateList : reduxState.dateList;
  const selectedDate = useMobx ? flightStore.selectedDate : reduxState.selectedDate;
  const sortType = useMobx ? flightStore.sortType : reduxState.sortType;
  const isLoading = useMobx ? flightStore.isLoading : reduxState.isLoading;

  const handleDateChange = useCallback((date: string) => {
    if (useMobx) {
      flightStore.setSelectedDate(date);
    } else {
      dispatch({ type: 'SET_SELECTED_DATE', payload: date });
      dispatch(loadFlightsAsync(date, reduxState.sortType));
    }
  }, [useMobx, dispatch, reduxState.sortType]);

  const handleSortChange = useCallback((sort: SortType) => {
    if (useMobx) {
      flightStore.setSortType(sort);
    } else {
      dispatch({ type: 'SET_SORT_TYPE', payload: sort });
      dispatch(loadFlightsAsync(reduxState.selectedDate, sort));
    }
  }, [useMobx, dispatch, reduxState.selectedDate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      
      if (scrollTop > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        setFilterBarVisible(false);
      } else {
        setFilterBarVisible(true);
      }

      setLastScrollTop(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!useMobx && flights.length === 0) {
      dispatch(loadFlightsAsync(selectedDate, sortType));
    }
  }, []);

  return (
    <div className="app">
      <Header />
      <DatePicker
        dateList={dateList}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      
      <div className="toggle-container">
        <button
          className={`toggle-btn ${useMobx ? 'active' : ''}`}
          onClick={() => setUseMobx(true)}
        >
          MobX
        </button>
        <button
          className={`toggle-btn ${!useMobx ? 'active' : ''}`}
          onClick={() => setUseMobx(false)}
        >
          Redux
        </button>
      </div>

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
