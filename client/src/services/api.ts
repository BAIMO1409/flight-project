import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import { Flight, DateItem, SortType } from '../types';

const BASE_URL = 'http://localhost:3003';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

let cancelTokenSource: CancelTokenSource | null = null;

export interface FlightsResponse {
  code: number;
  message: string;
  data: {
    flights: Flight[];
    total: number;
    dateList: DateItem[];
  };
}

export interface DatesResponse {
  code: number;
  message: string;
  data: DateItem[];
}

export const api = {
  getFlights: async (date: string, sort: SortType): Promise<FlightsResponse> => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('取消之前的请求');
    }
    
    cancelTokenSource = axios.CancelToken.source();
    
    try {
      const response: AxiosResponse<FlightsResponse> = await instance.get('/api/flights', {
        params: {
          date,
          sort,
          page: 1,
        },
        cancelToken: cancelTokenSource.token,
      });
      
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw error;
      }
      throw error;
    }
  },
  
  getDates: async (): Promise<DatesResponse> => {
    const response: AxiosResponse<DatesResponse> = await instance.get('/api/dates');
    return response.data;
  },
};

export const STORAGE_KEYS = {
  SELECTED_DATE: 'flight_selected_date',
  SORT_TYPE: 'flight_sort_type',
};

export const storage = {
  saveSelectedDate: (date: string) => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, date);
  },
  
  getSelectedDate: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_DATE);
  },
  
  saveSortType: (sort: SortType) => {
    localStorage.setItem(STORAGE_KEYS.SORT_TYPE, sort);
  },
  
  getSortType: (): SortType | null => {
    const value = localStorage.getItem(STORAGE_KEYS.SORT_TYPE);
    if (value === 'recommend' || value === 'time' || value === 'price') {
      return value;
    }
    return null;
  },
  
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_DATE);
    localStorage.removeItem(STORAGE_KEYS.SORT_TYPE);
  },
};
