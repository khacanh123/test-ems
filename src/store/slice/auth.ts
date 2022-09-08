import { createSlice } from '@reduxjs/toolkit';
import { loginRequest } from 'api';
import { getUserinfo } from 'api';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    dataUser: {},
    userInfo: {},
  },
  reducers: {
    setDataUser: (state, action) => {
      state.dataUser = action.payload;
      localStorage.removeItem('tk');
      if (action.payload.status) {
        localStorage.setItem('tk', action.payload.token);
      }
    },
    setUserinfo: (state, action) => {
      state.userInfo = action.payload;
      // localStorage.removeItem('tk');
      // if (action.payload.status) {
      //     localStorage.setItem('tk', action.payload.token);
      // }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginRequest.fulfilled, (state: any, action: any) => {
      authSlice.caseReducers.setDataUser(state, action);
    });
    builder.addCase(getUserinfo.fulfilled, (state: any, action: any) => {
      authSlice.caseReducers.setUserinfo(state, action);
    });
  },
});

export const { setDataUser, setUserinfo } = authSlice.actions;
