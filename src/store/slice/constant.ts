import { createSlice } from '@reduxjs/toolkit';
import { getConstant } from 'api';
import { constantDefault } from 'constant';

export const constantSlice = createSlice({
  name: 'constant',
  initialState: {
    constant: constantDefault,
  },
  reducers: {
    setConstant: (state, action) => {
      if (action?.payload?.baikiemtra) {
        state.constant = action.payload;
      } else {
        state.constant = constantDefault;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConstant.fulfilled, (state: any, action: any) => {
      constantSlice.caseReducers.setConstant(state, action);
    });
  },
});
