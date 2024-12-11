import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialUserState, UserData } from "../../utils/types";

// user slice with setting user's data
const userSlice = createSlice({
  name: "user", // name of the slice
  initialState: initialUserState, // initial state of the slice
  reducers: {
    // set current user's data
    setData: (state, action: PayloadAction<{ userData: UserData }>) => {
      state = { ...action.payload.userData };
    },
  },
});

// export actions and reducers
export const { setData } = userSlice.actions;
export default userSlice.reducer;
