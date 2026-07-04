import { Flight, DateItem, SortType } from '../../types';

export interface ReduxState {
  flights: Flight[];
  dateList: DateItem[];
  selectedDate: string;
  sortType: SortType;
  isLoading: boolean;
}

export type Action =
  | { type: 'SET_FLIGHTS'; payload: Flight[] }
  | { type: 'SET_DATE_LIST'; payload: DateItem[] }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'SET_SORT_TYPE'; payload: SortType }
  | { type: 'SET_LOADING'; payload: boolean };
