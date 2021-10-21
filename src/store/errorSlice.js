import { createSlice } from "@reduxjs/toolkit";

const initialErrorState = {
  getDataset: { open: false, message: "" },
  getComments: { open: false, message: "" },
  updateDataset: { open: false, message: "" },
  submitFollow: {
    open: false,
    message: "An error occured. Failed to update your follow, please try again",
  },
  submitVote: {
    open: false,
    message: "An error occured. Failed to update your vote, please try again",
  },
  submitLike: {
    open: false,
    message: "An error occured. Failed to update your like, please try again",
  },
  submitComment: {
    open: false,
    message:
      "An error occured. Failed to update your comment, please try again",
  },
  submitPoll: {
    open: false,
    message: "An error occured. Failed to create your poll, please try again",
  },
  submitDeletePoll: {
    open: false,
    message: "An error occured. Failed to delete your poll, please try again",
  },
};

const errorSlice = createSlice({
  name: "error",
  initialState: initialErrorState,
  reducers: {
    clearHttpError(state, action) {
      state[action.payload].open = false;
    },
    activateHttpError(state, action) {
      state[action.payload].open = true;
    },
  },
});

export const errorActions = errorSlice.actions;

export default errorSlice;
