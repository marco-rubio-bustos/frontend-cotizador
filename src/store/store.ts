// src/store.ts
import { configureStore } from '@reduxjs/toolkit';

// Definir el estado inicial
const initialState = {
  selectedCustomer: null,
};

// Crear el reducer
const customerReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_SELECTED_CUSTOMER':
      return { ...state, selectedCustomer: action.payload };
    default:
      return state;
  }
};

// Crear el store
const store = configureStore({
  reducer: customerReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



