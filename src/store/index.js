import { configureStore } from "@reduxjs/toolkit";

import errorSlice from "./errorSlice";
import userSlice from "./userSlice";
import pollSlice from "./pollSlice";

const store = configureStore({
  reducer: {
    error: errorSlice.reducer,
    user: userSlice.reducer,
    poll: pollSlice.reducer,
  },
});

export default store;
