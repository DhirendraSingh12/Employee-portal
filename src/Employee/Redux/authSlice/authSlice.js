import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: {
    name: '',
  },
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log('Login successful: ', action.payload);
      state.isAuthenticated = true;
      state.user = action.payload.user;  // Storing the decoded user information
      state.token = action.payload.token; // Storing the JWT token
    },
    logout: (state) => {
      console.log('Logout successful');
      state.isAuthenticated = false;
      state.user = { name: '' };
      state.token = '';  // Clear the token
      localStorage.removeItem('jwtToken');  // Remove token from localStorage
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
