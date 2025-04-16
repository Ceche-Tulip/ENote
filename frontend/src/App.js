import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import ErrorBoundary from './components/common/ErrorBoundary';

// 布局
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// 认证页面
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// 导入每个页面组件
import Dashboard from './pages/Dashboard';
import NoteList from './pages/notes/NoteList';
import NoteDetail from './pages/notes/NoteDetail';
import NoteEditor from './pages/notes/NoteEditor';
import CategoryList from './pages/categories/CategoryList';
import TagList from './pages/tags/TagList';

// 权限验证组件
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  if (!isAuthenticated) {
    // 如果未登录，重定向到登录页面
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            {/* 认证路由 */}
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Navigate to="/login" />} />
              <Route path="login" element={
                <ErrorBoundary title="登录出错" onReset={() => window.location.href = '/login'}>
                  <Login />
                </ErrorBoundary>
              } />
              <Route path="register" element={
                <ErrorBoundary title="注册出错" onReset={() => window.location.href = '/register'}>
                  <Register />
                </ErrorBoundary>
              } />
            </Route>
            
            {/* 受保护的主应用路由 */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={
                <ErrorBoundary title="仪表盘出错">
                  <Dashboard />
                </ErrorBoundary>
              } />
              <Route path="notes" element={
                <ErrorBoundary title="笔记列表加载出错">
                  <NoteList />
                </ErrorBoundary>
              } />
              <Route path="notes/new" element={
                <ErrorBoundary title="创建笔记出错" onReset={() => window.location.href = '/notes'}>
                  <NoteEditor />
                </ErrorBoundary>
              } />
              <Route path="notes/:id" element={
                <ErrorBoundary title="笔记详情加载出错" onReset={() => window.location.href = '/notes'}>
                  <NoteDetail />
                </ErrorBoundary>
              } />
              <Route path="notes/:id/edit" element={
                <ErrorBoundary title="编辑笔记出错" onReset={() => window.location.href = '/notes'}>
                  <NoteEditor />
                </ErrorBoundary>
              } />
              <Route path="categories" element={
                <ErrorBoundary title="分类列表加载出错">
                  <CategoryList />
                </ErrorBoundary>
              } />
              <Route path="tags" element={
                <ErrorBoundary title="标签列表加载出错">
                  <TagList />
                </ErrorBoundary>
              } />
            </Route>
            
            {/* 如果路径不匹配，重定向到首页 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

// 全局错误处理函数，可以用于记录错误或者发送到错误监控系统
window.onerror = (message, source, lineno, colno, error) => {
  console.error('全局错误:', {
    message,
    source,
    lineno,
    colno,
    error
  });
  return false; // 返回 false 让浏览器继续执行默认的错误处理
};

// 监听未捕获的Promise错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise错误:', event.reason);
});

export default App;
