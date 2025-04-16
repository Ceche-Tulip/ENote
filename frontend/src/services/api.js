import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API的基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token到请求头
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理常见错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 获取详细的错误信息
    const errorResponse = {
      message: error.message || '未知错误',
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    };

    // 处理特定状态码错误
    switch (error.response?.status) {
      case 400:
        console.error('请求参数错误:', errorResponse);
        break;
      case 401:
        console.error('未授权访问:', errorResponse);
        // 清除本地存储的登录信息
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // 重定向到登录页，但避免在登录页上再次触发重定向
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        break;
      case 403:
        console.error('访问被禁止:', errorResponse);
        break;
      case 404:
        console.error('资源不存在:', errorResponse);
        break;
      case 500:
        console.error('服务器错误:', errorResponse);
        break;
      default:
        // 处理网络错误和其他错误
        if (error.message.includes('Network Error')) {
          console.error('网络连接失败，请检查您的网络连接:', errorResponse);
        } else if (error.message.includes('timeout')) {
          console.error('请求超时，请稍后重试:', errorResponse);
        } else {
          console.error('API错误:', errorResponse);
        }
    }

    // 将具体错误信息返回给调用方
    return Promise.reject({
      ...error,
      customMessage: getErrorMessage(error)
    });
  }
);

// 格式化错误消息以便于显示给用户
function getErrorMessage(error) {
  if (error.response) {
    // 服务器返回了错误响应
    const serverMessage = error.response.data?.message || error.response.data;
    if (typeof serverMessage === 'string') {
      return serverMessage;
    }
    
    switch (error.response.status) {
      case 400: return '请求参数错误';
      case 401: return '您的登录状态已过期，请重新登录';
      case 403: return '您没有权限执行此操作';
      case 404: return '请求的资源不存在';
      case 500: return '服务器内部错误，请稍后再试';
      default: return `请求失败 (${error.response.status})`;
    }
  } else if (error.request) {
    // 请求已发出但没有收到响应
    if (error.message.includes('timeout')) {
      return '请求超时，请检查您的网络连接并稍后再试';
    }
    return '无法连接到服务器，请检查您的网络连接';
  } else {
    // 请求设置触发的错误
    return '请求配置错误';
  }
}

export default api;