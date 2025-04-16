import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import noteReducer from './noteSlice';
import categoryReducer from './categorySlice';
import tagReducer from './tagSlice';

// 配置Redux Store
const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: noteReducer,
    categories: categoryReducer,
    tags: tagReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 禁用序列化检查以避免非序列化值的警告
    }),
});

export default store;