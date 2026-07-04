import { createStore, applyMiddleware, Action } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { flightReducer, loadFlightsAsync } from './reducer';
import { ReduxState } from './types';

export const store = createStore(flightReducer, applyMiddleware(thunk));

export type AppDispatch = ThunkDispatch<ReduxState, undefined, Action>;
export type AppThunk = ThunkAction<void, ReduxState, undefined, Action>;

export { loadFlightsAsync };