import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action) {
      state = action.payload;
      return state;
    },
    createPost(state, action) {
      return [...state, action.payload];
    },
    deletePost(state, action) {
      state = state.filter((post) => post._id !== action.payload.id);
      return state;
    },
    editPost(state, action) {
      state = state.map((post) => {
        if (post._id === action.payload.id) {
          post.question = action.payload.question;
          return post;
        }
        return post;
      });
    },
    addComment(state, action) {
      state = state.map((post) => {
        if (post._id === action.payload.postId) {
          post.comments.push(action.payload.comment);
          console.log(action.payload);
          return post;
        }
        return post;
      });
    },
    setPinned(state, action) {
      state = state.map((post) => {
        if (post._id === action.payload.postId) {
          post.pinned = !post.pinned;
          return post;
        }
        return post;
      });
    },
    likePost(state, action) {
      state = state.map((post) => {
        if (post._id === action.payload.postId) {
          if (post.likes.includes(action.payload.userId)) {
            const index = post.likes.indexOf(action.payload.userId);
            post.likes.splice(index, 1);
          } else {
            post.likes.push(action.payload.userId);
          }
          return post;
        }
        return post;
      });
    },
  },
});

export const {
  createPost,
  deletePost,
  setPosts,
  editPost,
  addComment,
  setPinned,
  likePost,
} = postSlice.actions;
export default postSlice.reducer;
