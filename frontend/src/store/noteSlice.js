import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noteService from '../services/noteService';

// 异步thunk action - 获取所有笔记
export const fetchAllNotes = createAsyncThunk(
  'notes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await noteService.getAllNotes();
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notes');
    }
  }
);

// 异步thunk action - 获取单个笔记
export const fetchNoteById = createAsyncThunk(
  'notes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await noteService.getNoteById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch note');
    }
  }
);

// 异步thunk action - 创建笔记
export const createNote = createAsyncThunk(
  'notes/create',
  async (noteData, { rejectWithValue, getState, dispatch }) => {
    try {
      // 如果没有指定分类ID，尝试获取默认分类
      if (!noteData.categoryId) {
        try {
          // 从categoryService导入方法
          const { getDefaultCategory } = require('../services/categoryService').default;
          const defaultCategory = await getDefaultCategory();
          
          if (defaultCategory && defaultCategory.id) {
            // 使用默认分类ID
            noteData = {
              ...noteData,
              categoryId: defaultCategory.id
            };
            console.log('使用默认分类"未分类"创建笔记');
          }
        } catch (error) {
          console.warn('获取默认分类失败，继续创建无分类的笔记', error);
        }
      }
      
      return await noteService.createNote(noteData);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create note');
    }
  }
);

// 异步thunk action - 更新笔记
export const updateNote = createAsyncThunk(
  'notes/update',
  async ({ id, noteData }, { rejectWithValue }) => {
    try {
      return await noteService.updateNote(id, noteData);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update note');
    }
  }
);

// 异步thunk action - 删除笔记
export const deleteNote = createAsyncThunk(
  'notes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await noteService.deleteNote(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete note');
    }
  }
);

// 异步thunk action - 根据分类获取笔记
export const fetchNotesByCategory = createAsyncThunk(
  'notes/fetchByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      return await noteService.getNotesByCategory(categoryId);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notes by category');
    }
  }
);

// 异步thunk action - 根据标签获取笔记
export const fetchNotesByTag = createAsyncThunk(
  'notes/fetchByTag',
  async (tagId, { rejectWithValue }) => {
    try {
      return await noteService.getNotesByTag(tagId);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notes by tag');
    }
  }
);

// 初始状态
const initialState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
};

// 创建notes切片
const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取所有笔记
      .addCase(fetchAllNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchAllNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 获取单个笔记
      .addCase(fetchNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNote = action.payload;
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 创建笔记
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = [...state.notes, action.payload];
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 更新笔记
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        state.currentNote = action.payload;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 删除笔记
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter(note => note.id !== action.payload);
        if (state.currentNote && state.currentNote.id === action.payload) {
          state.currentNote = null;
        }
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 根据分类获取笔记
      .addCase(fetchNotesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 根据标签获取笔记
      .addCase(fetchNotesByTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotesByTag.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotesByTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentNote, clearError } = noteSlice.actions;
export default noteSlice.reducer;