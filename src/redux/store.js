import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/postsSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
  },
});

export default store;
