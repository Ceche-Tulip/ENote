import api from './api';
import { validateData, noteSchema } from '../utils/validator';

// 笔记服务
const noteService = {
  // 获取所有笔记
  getAllNotes: async () => {
    try {
      const response = await api.get('/notes');
      
      // 检查响应格式是否为分页格式 (Spring Data 分页格式)
      if (response.data && typeof response.data === 'object' && 'content' in response.data) {
        // 处理分页数据，提取 content 字段
        return Array.isArray(response.data.content) ? response.data.content : [];
      }
      
      // 如果响应不是分页格式，检查是否为数组
      if (!Array.isArray(response.data)) {
        console.error('API返回的笔记列表不是数组格式或分页格式');
        return [];
      }
      
      // 如果是普通数组，直接返回
      return response.data;
    } catch (error) {
      console.error('获取所有笔记失败:', error);
      // 即使发生错误，也返回空数组，防止应用崩溃
      return [];
    }
  },
  
  // 获取单个笔记详情
  getNoteById: async (id) => {
    try {
      const response = await api.get(`/notes/${id}`);
      // 验证返回的单个笔记数据，但不阻止返回
      if (!validateData(response.data, 'note', false)) {
        console.warn(`ID为 ${id} 的笔记数据格式不完全符合预期，但仍会显示`);
      }
      return response.data;
    } catch (error) {
      console.error(`获取ID为 ${id} 的笔记失败:`, error);
      throw error;
    }
  },
  
  // 创建新笔记
  createNote: async (noteData) => {
    try {
      // 确保提交的数据不会导致服务器错误，处理可能的空值
      const cleanedData = {
        ...noteData,
        // 如果没有提供分类，则不发送该字段而不是发送null
        ...(!noteData.categoryId && { categoryId: undefined }),
        // 如果没有提供标签，默认为空数组
        tagIds: Array.isArray(noteData.tagIds) ? noteData.tagIds : []
      };
      
      const response = await api.post('/notes', cleanedData);
      
      // 即使验证失败也返回数据，只记录警告
      if (!validateData(response.data, 'note', false)) {
        console.warn('创建笔记后返回的数据格式不完全符合预期，但仍会处理');
      }
      return response.data;
    } catch (error) {
      console.error('创建笔记失败:', error);
      throw error;
    }
  },
  
  // 更新笔记
  updateNote: async (id, noteData) => {
    try {
      // 处理可能的空值
      const cleanedData = {
        ...noteData,
        // 如果没有提供分类，则不发送该字段而不是发送null
        ...(!noteData.categoryId && { categoryId: undefined }),
        // 如果没有提供标签，默认为空数组
        tagIds: Array.isArray(noteData.tagIds) ? noteData.tagIds : []
      };
      
      const response = await api.put(`/notes/${id}`, cleanedData);
      
      if (!validateData(response.data, 'note', false)) {
        console.warn('更新笔记后返回的数据格式不完全符合预期，但仍会处理');
      }
      return response.data;
    } catch (error) {
      console.error(`更新ID为 ${id} 的笔记失败:`, error);
      throw error;
    }
  },
  
  // 删除笔记
  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`删除ID为 ${id} 的笔记失败:`, error);
      throw error;
    }
  },
  
  // 根据分类获取笔记
  getNotesByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/notes/category/${categoryId}`);
      
      // 处理分页格式
      if (response.data && typeof response.data === 'object' && 'content' in response.data) {
        return Array.isArray(response.data.content) ? response.data.content : [];
      }
      
      // 处理普通数组格式
      if (!Array.isArray(response.data)) {
        console.error(`获取分类 ${categoryId} 的笔记列表不是数组格式`);
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error(`获取分类 ${categoryId} 的笔记失败:`, error);
      return []; // 出错时返回空数组
    }
  },
  
  // 根据标签获取笔记
  getNotesByTag: async (tagId) => {
    try {
      const response = await api.get(`/notes/tag/${tagId}`);
      
      // 处理分页格式
      if (response.data && typeof response.data === 'object' && 'content' in response.data) {
        return Array.isArray(response.data.content) ? response.data.content : [];
      }
      
      // 处理普通数组格式
      if (!Array.isArray(response.data)) {
        console.error(`获取标签 ${tagId} 的笔记列表不是数组格式`);
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error(`获取标签 ${tagId} 的笔记失败:`, error);
      return []; // 出错时返回空数组
    }
  }
};

export default noteService;