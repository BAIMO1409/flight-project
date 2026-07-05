import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Flight, DateItem, SortType } from '../../types';
import { api, storage } from '../../services/api';

interface FlightState {
  flights: Flight[];
  dateList: DateItem[];
  selectedDate: string;
  sortType: SortType;
  isLoading: boolean;
}

const initialState: FlightState = {
  flights: [],
  dateList: [],
  selectedDate: '',
  sortType: 'recommend',
  isLoading: false,
};

export const initFlightData = createAsyncThunk(
  'flight/init',
  async (_, { dispatch }) => {
    try {
      const storedDate = storage.getSelectedDate();
      const storedSort = storage.getSortType() as SortType;
      
      const datesResponse = await api.getDates();
      
      let selectedDate = storedDate;
      if (!selectedDate || !datesResponse.data.find((item: DateItem) => item.date === selectedDate)) {
        selectedDate = datesResponse.data[1]?.date || datesResponse.data[0]?.date || '';
      }
      
      let sortType = storedSort;
      if (!sortType) {
        sortType = 'recommend';
      }
      
      dispatch(setDateList(datesResponse.data));
      dispatch(setSelectedDate(selectedDate));
      dispatch(setSortType(sortType));
      
      dispatch(loadFlights({ date: selectedDate, sort: sortType }));
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }
);

export const loadFlights = createAsyncThunk(
  'flight/load',
  async ({ date, sort }: { date: string; sort: SortType }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await api.getFlights(date, sort);
      
      dispatch(setFlights(response.data.flights));
      dispatch(setDateList(response.data.dateList));
      dispatch(setLoading(false));
    } catch (error) {
      console.error('Failed to load flights:', error);
      dispatch(setLoading(false));
    }
  }
);

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setFlights: (state, action: PayloadAction<Flight[]>) => {
      state.flights = action.payload;
    },
    setDateList: (state, action: PayloadAction<DateItem[]>) => {
      state.dateList = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
      storage.saveSelectedDate(action.payload);
    },
    setSortType: (state, action: PayloadAction<SortType>) => {
      state.sortType = action.payload;
      storage.saveSortType(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setFlights, setDateList, setSelectedDate, setSortType, setLoading } = flightSlice.actions;

export default flightSlice.reducer;
