import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getInitialRole = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.role || null;
    }
  } catch (error) {
    // console.error("Invalid token:", error);
  }
  return null;
};

const initialState = {
  role: getInitialRole(),
  status: "idle",
  error: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    clearRole: (state) => {
      state.role = null;
    }
  }
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;
