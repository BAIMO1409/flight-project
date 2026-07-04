import { makeAutoObservable, runInAction } from 'mobx';
import { Flight, DateItem, SortType } from '../../types';
import { generateDateList, generateMockFlights } from '../../utils';

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

  init() {
    this.dateList = generateDateList();
    this.selectedDate = this.dateList[1]?.date || '';
    this.loadFlights();
  }

  setSelectedDate(date: string) {
    this.selectedDate = date;
    this.loadFlights();
  }

  setSortType(sort: SortType) {
    this.sortType = sort;
    this.loadFlights();
  }

  async loadFlights() {
    this.isLoading = true;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const selectedDateItem = this.dateList.find(item => item.date === this.selectedDate);
    const basePrice = selectedDateItem?.price || 400;
    
    let flights = generateMockFlights(basePrice);
    
    switch (this.sortType) {
      case 'price':
        flights = flights.sort((a, b) => a.price - b.price);
        break;
      case 'time':
        flights = flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      default:
        break;
    }
    
    runInAction(() => {
      this.flights = flights;
      this.isLoading = false;
    });
  }
}

export const flightStore = new FlightStore();
