import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialUserState, UserData } from "../../utils/types";

// user slice with setting user's data
const userSlice = createSlice({
  name: "user", // name of the slice
  initialState: initialUserState, // initial state of the slice
  reducers: {
    // set current user's data
    setUserData: (state, action: PayloadAction<{ userData: UserData }>) => {
      // Redux Toolkit doesn't allow passing new object to state so we need to assign it
      Object.assign(state, action.payload.userData);
      console.log("STATE: " + action.payload.userData);
    },
  },
});

// export actions and reducers
export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
