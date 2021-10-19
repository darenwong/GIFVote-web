import { configureStore } from "@reduxjs/toolkit";

import errorSlice from "./errorSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: { error: errorSlice.reducer, user: userSlice.reducer },
});

export default store;
