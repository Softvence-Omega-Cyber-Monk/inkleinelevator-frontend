// import { RootState } from "@/redux/store";
import { RootState } from "@/Redux/store";
import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../store";

export type TUser = {
  userId: string;
  role: string;
  email: string;
  name: string;
  phone: string;
  iat: number;
  exp: number;
  profileImg: string;
  isAgree?: boolean;
};

type TAuthState = {
  user: null | TUser;
  accessToken: null | string;
};

const initialState: TAuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.accessToken = token;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
    updateUserAgree: (state, action) => {
      if (state.user) {
        state.user.isAgree = action.payload;
      }
    },
  },
});

export const { setUser, logout, updateUserAgree } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.accessToken;
export const selectCurrentUser = (state: RootState) => state.auth.user;
