import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tagService from '../services/tagService';

// 异步thunk action - 获取所有标签
export const fetchAllTags = createAsyncThunk(
  'tags/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await tagService.getAllTags();
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tags');
    }
  }
);

// 异步thunk action - 获取单个标签
export const fetchTagById = createAsyncThunk(
  'tags/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await tagService.getTagById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tag');
    }
  }
);

// 异步thunk action - 创建标签
export const createTag = createAsyncThunk(
  'tags/create',
  async (tagData, { rejectWithValue }) => {
    try {
      return await tagService.createTag(tagData);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create tag');
    }
  }
);

// 异步thunk action - 更新标签
export const updateTag = createAsyncThunk(
  'tags/update',
  async ({ id, tagData }, { rejectWithValue }) => {
    try {
      return await tagService.updateTag(id, tagData);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update tag');
    }
  }
);

// 异步thunk action - 删除标签
export const deleteTag = createAsyncThunk(
  'tags/delete',
  async (id, { rejectWithValue }) => {
    try {
      await tagService.deleteTag(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete tag');
    }
  }
);

// 初始状态
const initialState = {
  tags: [],
  currentTag: null,
  loading: false,
  error: null,
};

// 创建tags切片
const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    clearCurrentTag: (state) => {
      state.currentTag = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取所有标签
      .addCase(fetchAllTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchAllTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 获取单个标签
      .addCase(fetchTagById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTagById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTag = action.payload;
      })
      .addCase(fetchTagById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 创建标签
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = [...state.tags, action.payload];
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 更新标签
      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tags.findIndex(tag => tag.id === action.payload.id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
        state.currentTag = action.payload;
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 删除标签
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = state.tags.filter(tag => tag.id !== action.payload);
        if (state.currentTag && state.currentTag.id === action.payload) {
          state.currentTag = null;
        }
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentTag, clearError } = tagSlice.actions;
export default tagSlice.reducer;