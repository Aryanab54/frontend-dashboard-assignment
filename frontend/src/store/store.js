import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('dashboardState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem('dashboardState', JSON.stringify(state));
  } catch (err) {
    // Ignore write errors
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
  preloadedState: persistedState
});

store.subscribe(() => {
  saveState({
    dashboard: store.getState().dashboard
  });
});