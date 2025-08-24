import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Settings {
  notifications: {
    taskAlerts: boolean;
    slaBreaches: boolean;
  };
  theme: 'dark' | 'light';
  language: string;
}

interface SettingsState {
  settings: Settings;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {
    notifications: {
      taskAlerts: true,
      slaBreaches: true,
    },
    theme: 'dark',
    language: 'en',
  },
  loading: false,
  error: null,
};

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings: Partial<Settings>) => {
    // TODO: Implement API call to save settings
    return settings;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.settings.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.settings.language = action.payload;
    },
    toggleNotification: (state, action) => {
      const { type, enabled } = action.payload;
      state.settings.notifications[type] = enabled;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
        state.loading = false;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update settings';
      });
  },
});

export const { setTheme, setLanguage, toggleNotification } = settingsSlice.actions;
export default settingsSlice.reducer;
