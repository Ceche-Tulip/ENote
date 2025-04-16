import api from './api';

// 认证服务
const authService = {
  // 用户登录
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // 用户注册
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // 用户登出
  logout: async () => {
    try {
      // 调用后端登出接口
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // 清除本地存储的登录信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // 获取当前登录用户信息
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    // 确保 userStr 是有效的非 null 和非 undefined 值
    if (userStr && userStr !== "undefined") {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error("获取用户信息失败:", error);
        // 如果解析失败，清除可能损坏的用户数据
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  },

  // 检查用户是否已登录
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;