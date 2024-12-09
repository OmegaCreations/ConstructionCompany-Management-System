import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authSlice, // auth slice
  },
});

export type AppDispatch = typeof store.dispatch; // dispatch used to invoke slice's functions

export type RootState = ReturnType<typeof store.getState>; // state of the store used in typescript
export default store;
