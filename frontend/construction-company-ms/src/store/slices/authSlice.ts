import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface for auth slice
interface AuthState {
  isUserAuthenticated: boolean;
  user_id: number;
  role: "manager" | "worker" | null;
  token: string | null;
}

// initial slice without data
const initialState: AuthState = {
  isUserAuthenticated: false,
  user_id: -1,
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
    login: (
      state,
      action: PayloadAction<{ token: string; role: string; user_id: number }>
    ) => {
      state.isUserAuthenticated = true;
      state.role = action.payload.role as "manager" | "worker";
      state.token = action.payload.token;
      state.user_id = action.payload.user_id;
    },

    // logout user
    logout: (state) => {
      localStorage.clear();
      state.isUserAuthenticated = false;
      state.role = null;
      state.token = null;
      state.user_id = -1;
    },

    // sets new access token
    setAccessToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      localStorage.setItem("jwt", state.token);
    },
  },
});

// export actions and reducers
export const { login, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
