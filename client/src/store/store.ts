import { configureStore } from "@reduxjs/toolkit";
import historyReducer from "./historySlice";
import historyVidReducer from "./historyVidSlice";
import historyModelReducer from "./historyModelSlice";

export const store = configureStore({
  reducer: {
    history: historyReducer,
    historyVid: historyVidReducer,
    historyModel: historyModelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
