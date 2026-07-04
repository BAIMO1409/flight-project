export interface Flight {
  id: string;
  flightNo: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  price: number;
  discount: string;
  duration: string;
  aircraft: string;
  seats?: string;
}

export interface DateItem {
  date: string;
  week: string;
  price: number;
  isToday: boolean;
}

export type SortType = 'recommend' | 'time' | 'price';

export interface SearchCondition {
  date: string;
  sort: SortType;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface FlightsResponse {
  flights: Flight[];
  total: number;
  dateList: DateItem[];
}
