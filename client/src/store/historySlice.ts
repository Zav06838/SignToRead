import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HistoryItem {
  input: string;
  output: string;
}

interface HistoryState {
  items: HistoryItem[];
}

const initialState: HistoryState = {
  items: [],
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addHistoryItem: (state, action: PayloadAction<HistoryItem>) => {
      state.items.push(action.payload);
    },
  },
});

export const { addHistoryItem } = historySlice.actions;

export default historySlice.reducer;
