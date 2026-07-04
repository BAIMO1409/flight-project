import { makeAutoObservable, runInAction } from 'mobx';
import { Flight, DateItem, SortType } from '../../types';
import { api, storage } from '../../services/api';

class FlightStore {
  flights: Flight[] = [];
  dateList: DateItem[] = [];
  selectedDate: string = '';
  sortType: SortType = 'recommend';
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  async init() {
    try {
      const storedDate = storage.getSelectedDate();
      const storedSort = storage.getSortType();
      
      const datesResponse = await api.getDates();
      
      runInAction(() => {
        this.dateList = datesResponse.data;
        
        if (storedDate && this.dateList.find(item => item.date === storedDate)) {
          this.selectedDate = storedDate;
        } else {
          this.selectedDate = this.dateList[1]?.date || '';
        }
        
        if (storedSort) {
          this.sortType = storedSort;
        } else {
          this.sortType = 'recommend';
        }
      });
      
      await this.loadFlights();
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }

  setSelectedDate(date: string) {
    this.selectedDate = date;
    storage.saveSelectedDate(date);
    this.loadFlights();
  }

  setSortType(sort: SortType) {
    this.sortType = sort;
    storage.saveSortType(sort);
    this.loadFlights();
  }

  async loadFlights() {
    this.isLoading = true;
    
    try {
      const response = await api.getFlights(this.selectedDate, this.sortType);
      
      runInAction(() => {
        this.flights = response.data.flights;
        this.dateList = response.data.dateList;
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Failed to load flights:', error);
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const flightStore = new FlightStore();
