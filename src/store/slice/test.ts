import { createSlice } from '@reduxjs/toolkit';

export const testSlice = createSlice({
  name: 'test',
  initialState: {
    testEdit: {},
    listQuestion: [],
  },
  reducers: {
    updateTestEdit: (state, action) => {
      return { ...state, testEdit: action.payload };
    },
    clear: (state) => {
      return { ...state, testEdit: {} };
    },
    storeQuestion: (state, action) => {
      console.log(action.payload);

      state.listQuestion = action.payload;
    },
  },
});

export const { updateTestEdit, clear, storeQuestion } = testSlice.actions;
