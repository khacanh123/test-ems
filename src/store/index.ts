import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slice/auth';
import { constantSlice } from './slice/constant';
import { questionSlice } from './slice/question';
import { testSlice } from './slice/test';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    constant: constantSlice.reducer,
    question: questionSlice.reducer,
    test: testSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
  devTools: import.meta.env.NODE_ENV !== 'production',
});

export default store;
export type RootStore = ReturnType<typeof store.getState>;
