import { combineReducers, Reducer, CombinedState } from 'redux';

import themeReducer, { ThemeStateType } from './themeReducers';
import authReducer, { AuthInitialStateType } from './authReducers';
import msgReducer, { MsgStoreType } from './msgReducer';
import systemReducer from './systemReducer';
import eventsReducer, { EventsStateType } from './eventsReducer';
import { Status } from '../../common-types';

export const rootReducer: RootReducerType = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  msg: msgReducer,
  system: systemReducer,
  eventsData: eventsReducer,
});

export type RootReducerType = Reducer<
  CombinedState<{
    theme: ThemeStateType;
    auth: AuthInitialStateType;
    msg: MsgStoreType;
    system: Status;
    eventsData: EventsStateType;
  }>
>;
export type AppStateType = ReturnType<RootReducerType>;
