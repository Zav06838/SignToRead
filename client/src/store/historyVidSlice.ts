import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HistoryItem {
  input: string;
  output: string;
  video: string;
}

interface HistoryState {
  items: HistoryItem[];
}

const initialState: HistoryState = {
  items: [],
};

export const historyVidSlice = createSlice({
  name: "historyVid",
  initialState,
  reducers: {
    addHistoryItems: (state, action: PayloadAction<HistoryItem>) => {
      state.items.push(action.payload);
    },
  },
});

export const { addHistoryItems } = historyVidSlice.actions;

export default historyVidSlice.reducer;
