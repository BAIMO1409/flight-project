import { ReduxState, Action } from './types';
import { generateDateList, generateMockFlights } from '../../utils';
import { SortType } from '../../types';

const initialDateList = generateDateList();

const initialState: ReduxState = {
  flights: [],
  dateList: initialDateList,
  selectedDate: initialDateList[1]?.date || '',
  sortType: 'recommend',
  isLoading: false,
};

export const flightReducer = (state: ReduxState = initialState, action: Action): ReduxState => {
  switch (action.type) {
    case 'SET_FLIGHTS':
      return { ...state, flights: action.payload };
    case 'SET_DATE_LIST':
      return { ...state, dateList: action.payload };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_SORT_TYPE':
      return { ...state, sortType: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const loadFlightsAsync = (date: string, sort: SortType) => {
  return async (dispatch: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let flights = generateMockFlights();
    
    switch (sort) {
      case 'price':
        flights = flights.sort((a, b) => a.price - b.price);
        break;
      case 'time':
        flights = flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      default:
        break;
    }
    
    dispatch({ type: 'SET_FLIGHTS', payload: flights });
    dispatch({ type: 'SET_LOADING', payload: false });
  };
};
