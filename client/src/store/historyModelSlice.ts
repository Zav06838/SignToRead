import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HistoryItem {
  input: string;
  output: string;
  video: string | undefined;
}

interface HistoryState {
  items: HistoryItem[];
}

const initialState: HistoryState = {
  items: [],
};

export const historyModelSlice = createSlice({
  name: "historyModel",
  initialState,
  reducers: {
    addHistoryItems: (state, action: PayloadAction<HistoryItem>) => {
      state.items.push(action.payload);
    },
  },
});

export const { addHistoryItems } = historyModelSlice.actions;

export default historyModelSlice.reducer;
