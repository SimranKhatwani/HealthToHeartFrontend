import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: localStorage.getItem('mode') || 'light',

  header: {
    color: localStorage.getItem('headerColor') || '#22c55e',
    // gradient: localStorage.getItem('headerGradient') || 'bg-gradient-to-br from-slate-800 to-slate-600',
  },
  sidebar: {
    color: localStorage.getItem('sidebarColor') || '#22c55e',
    // gradient: localStorage.getItem('sidebarGradient') || 'bg-gradient-to-br from-slate-800 to-slate-600',
  },
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode: (state, action) => {
      const mode = action.payload;
      state.mode = mode;
      localStorage.setItem('mode', mode);
    },

    setHeaderColor: (state, action) => {
      state.header.color = action.payload;
      localStorage.setItem('headerColor', action.payload);
    },
    // setHeaderGradient: (state, action) => {
    //   state.header.gradient = action.payload;
    //   localStorage.setItem('headerGradient', action.payload);
    // },

    setSidebarColor: (state, action) => {
      state.sidebar.color = action.payload;
      localStorage.setItem('sidebarColor', action.payload);
    },
    // setSidebarGradient: (state, action) => {
    //   state.sidebar.gradient = action.payload;
    //   localStorage.setItem('sidebarGradient', action.payload);
    // },
  },
});

export const {
  setMode,
  setHeaderColor,
  // setHeaderGradient,
  setSidebarColor,
  // setSidebarGradient,
} = themeSlice.actions;

export default themeSlice.reducer;
