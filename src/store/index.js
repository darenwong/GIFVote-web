import { configureStore } from "@reduxjs/toolkit";

import errorSlice from "./errorSlice";

const store = configureStore({
  reducer: { error: errorSlice.reducer },
});

export default store;
