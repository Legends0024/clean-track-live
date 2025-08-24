import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TasksState, Task } from '../../types';
import { apiClient } from '../../api/api';

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (assignedTo: string | undefined = undefined, { rejectWithValue }) => {
    try {
      const url = assignedTo ? `/tasks?assignedTo=${assignedTo}` : '/tasks';
      const response = await apiClient.get(url);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return rejectWithValue('Failed to fetch tasks');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks'
      );
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return rejectWithValue('Failed to create task');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create task'
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Task> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/tasks/${id}`, updates);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return rejectWithValue('Failed to update task');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update task'
      );
    }
  }
);

export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async ({ id, imageUrl, inspectionData }: { 
    id: string; 
    imageUrl?: string; 
    inspectionData?: { score: number; label: string; } 
  }, { rejectWithValue }) => {
    try {
      const updates: Partial<Task> = {
        status: 'completed',
        completedAt: new Date().toISOString(),
        imageUrl,
        ...inspectionData,
      };
      
      const response = await apiClient.patch(`/tasks/${id}`, updates);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return rejectWithValue('Failed to complete task');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to complete task'
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/tasks/${id}`);
      
      if (response.success) {
        return id;
      }
      
      return rejectWithValue('Failed to delete task');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete task'
      );
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasksError: (state) => {
      state.error = null;
    },
    updateTaskOptimistic: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
      }
    },
    addTaskFromSocket: (state, action: PayloadAction<Task>) => {
      const existingIndex = state.tasks.findIndex(task => task.id === action.payload.id);
      if (existingIndex === -1) {
        state.tasks.unshift(action.payload);
      }
    },
    updateTaskFromSocket: (state, action: PayloadAction<{ taskId: string; status: Task['status']; completedBy?: string; completedAt?: string; }>) => {
      const { taskId, status, completedBy, completedAt } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          status,
          ...(completedBy && { assignedTo: completedBy }),
          ...(completedAt && { completedAt }),
          updatedAt: new Date().toISOString(),
        };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Complete task
    builder
      .addCase(completeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearTasksError, 
  updateTaskOptimistic, 
  addTaskFromSocket, 
  updateTaskFromSocket 
} = tasksSlice.actions;

export default tasksSlice.reducer;