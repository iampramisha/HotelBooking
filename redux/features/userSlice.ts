import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
  user: any;                 // You can replace `any` with a proper User type if available
  isAuthenticated: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload; // update user object
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload; // update authentication status
    },
  },
});

// Export the reducer to add to the store
export default userSlice.reducer;

// Export actions to dispatch from components
export const { setUser, setIsAuthenticated } = userSlice.actions;
