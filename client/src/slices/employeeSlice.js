import { createSlice } from '@reduxjs/toolkit';

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchEmployeesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchEmployeesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
} = employeeSlice.actions;

export default employeeSlice.reducer;




export const fetchEmployeesByLeadId = (employeeId) => async (dispatch) => {
    dispatch(fetchEmployeesStart());
  
    try {
      const token = localStorage.getItem('token');
  
      const res = await fetch(`http://localhost:3008/employees/lead/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      console.log("Employee data",data)
      dispatch(fetchEmployeesSuccess(data));
    } catch (err) {
      dispatch(fetchEmployeesFailure(err.message));
    }
  };
  