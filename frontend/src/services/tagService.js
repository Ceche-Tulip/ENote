import api from './api';

// 标签服务
const tagService = {
  // 获取所有标签
  getAllTags: async () => {
    try {
      const response = await api.get('/tags');
      
      // 处理分页格式（Spring Data 分页格式）
      if (response.data && typeof response.data === 'object' && 'content' in response.data) {
        return Array.isArray(response.data.content) ? response.data.content : [];
      }
      
      // 确保返回数组类型，即使后端返回null或其他非数组值
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('获取标签列表失败:', error);
      // 返回空数组而不是抛出错误，保证应用程序的稳定性
      return [];
    }
  },
  
  // 获取单个标签详情
  getTagById: async (id) => {
    try {
      const response = await api.get(`/tags/${id}`);
      return response.data;
    } catch (error) {
      console.error(`获取标签ID:${id}失败:`, error);
      throw error;
    }
  },
  
  // 创建新标签
  createTag: async (tagData) => {
    try {
      // 检查用户令牌是否存在
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('您需要登录才能创建标签');
      }
      
      const response = await api.post('/tags', tagData);
      return response.data;
    } catch (error) {
      // 处理特定权限错误
      if (error.response && error.response.status === 403) {
        throw new Error('您没有创建标签的权限，请联系管理员');
      }
      console.error('创建标签失败:', error);
      throw error;
    }
  },
  
  // 更新标签
  updateTag: async (id, tagData) => {
    try {
      const response = await api.put(`/tags/${id}`, tagData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        throw new Error('您没有修改标签的权限，请联系管理员');
      }
      console.error(`更新标签ID:${id}失败:`, error);
      throw error;
    }
  },
  
  // 删除标签
  deleteTag: async (id) => {
    try {
      const response = await api.delete(`/tags/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        throw new Error('您没有删除标签的权限，请联系管理员');
      }
      console.error(`删除标签ID:${id}失败:`, error);
      throw error;
    }
  }
};

export default tagService;