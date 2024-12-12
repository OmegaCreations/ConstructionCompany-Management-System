import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface for auth slice
interface AuthState {
  isUserAuthenticated: boolean;
  role: "manager" | "worker" | null;
  token: string | null;
}

// initial slice without data
const initialState: AuthState = {
  isUserAuthenticated: false,
  role: null,
  token: null,
};

// new slice with login/logout reducers
const authSlice = createSlice({
  name: "auth", // name of the slice
  initialState, // initial state of the slice
  reducers: {
    // reducers -> functions manipulating slice state
    // login user
    login: (state, action: PayloadAction<{ token: string; role: string }>) => {
      state.isUserAuthenticated = true;
      state.role = action.payload.role as "manager" | "worker";
      state.token = action.payload.token;
    },

    // logout user
    logout: (state) => {
      localStorage.clear();
      state.isUserAuthenticated = false;
      state.role = null;
      state.token = null;
    },
  },
});

// export actions and reducers
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
