import api from './api';

// 定义默认分类常量
export const DEFAULT_CATEGORY = {
  name: "未分类",
  description: "默认分类，用于存放未指定分类的笔记"
};

// 分类服务
const categoryService = {
  // 获取所有分类（包括检查并创建默认分类）
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories/all');
      
      // 检查响应格式是否为分页格式
      if (response.data && typeof response.data === 'object' && 'content' in response.data) {
        // 处理分页数据
        return Array.isArray(response.data.content) ? response.data.content : [];
      }
      
      // 如果响应不是分页数据但是数组
      const categories = Array.isArray(response.data) ? response.data : [];
      
      // 检查是否存在"未分类"分类，如果不存在则创建
      await ensureDefaultCategoryExists(categories);
      
      // 重新获取分类列表（包含新创建的默认分类）
      const refreshResponse = await api.get('/categories/all');
      return Array.isArray(refreshResponse.data) ? refreshResponse.data : 
             (refreshResponse.data && 'content' in refreshResponse.data ? 
              refreshResponse.data.content : []);
    } catch (error) {
      console.error('获取分类列表失败:', error);
      // 返回空数组而不是抛出错误，保证应用程序的稳定性
      return [];
    }
  },
  
  // 获取单个分类详情
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`获取分类ID:${id}失败:`, error);
      throw error;
    }
  },
  
  // 创建新分类
  createCategory: async (categoryData) => {
    try {
      // 检查用户令牌是否存在
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('您需要登录才能创建分类');
      }
      
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      // 处理特定权限错误
      if (error.response && error.response.status === 403) {
        throw new Error('您没有创建分类的权限，请联系管理员');
      }
      console.error('创建分类失败:', error);
      throw error;
    }
  },
  
  // 更新分类
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        throw new Error('您没有修改分类的权限，请联系管理员');
      }
      console.error(`更新分类ID:${id}失败:`, error);
      throw error;
    }
  },
  
  // 删除分类
  deleteCategory: async (id) => {
    try {
      // 获取默认分类以确保不会删除它
      const defaultCategory = await getDefaultCategory();
      
      // 如果要删除的是默认分类，阻止操作
      if (defaultCategory && defaultCategory.id === id) {
        throw new Error('默认分类"未分类"不能被删除');
      }
      
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        throw new Error('您没有删除分类的权限，请联系管理员');
      }
      console.error(`删除分类ID:${id}失败:`, error);
      throw error;
    }
  },
  
  // 获取默认分类
  getDefaultCategory: async () => {
    try {
      return await getDefaultCategory();
    } catch (error) {
      console.error('获取默认分类失败:', error);
      return null;
    }
  }
};

// 辅助函数：确保默认分类存在
async function ensureDefaultCategoryExists(categories) {
  try {
    // 查找名为"未分类"的分类
    const defaultCat = categories.find(cat => 
      cat.name.toLowerCase() === DEFAULT_CATEGORY.name.toLowerCase());
    
    // 如果不存在，则创建默认分类
    if (!defaultCat) {
      console.log('创建默认分类:"未分类"');
      await categoryService.createCategory(DEFAULT_CATEGORY);
      return true;
    }
    return false;
  } catch (error) {
    console.error('创建默认分类失败:', error);
    return false;
  }
}

// 辅助函数：获取默认分类
async function getDefaultCategory() {
  try {
    const categories = await categoryService.getAllCategories();
    return categories.find(cat => 
      cat.name.toLowerCase() === DEFAULT_CATEGORY.name.toLowerCase());
  } catch (error) {
    console.error('获取默认分类失败:', error);
    return null;
  }
}

export default categoryService;