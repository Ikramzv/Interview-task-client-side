import { createSlice } from "@reduxjs/toolkit";

const initialState = () => {
  return JSON.parse(localStorage.getItem("user")) == (null || undefined)
    ? null
    : JSON.parse(localStorage.getItem("user"));
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState(),
  reducers: {
    setUser(state, action) {
      state = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      return state;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
