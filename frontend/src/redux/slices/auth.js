import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: null,
    currentUser: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signupStart: (state, action) =>{
            state.loading = true;
        },
        signupSuccess: (state, action) =>{
            state.loading = false;
        },
        signupFailure: (state, action) =>{
            state.loading = false;
        },
        loginStart: (state, action) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state, action) => {
            state.loading = false;
        },
        logOut: (state) => {
            state.currentUser = null;
        },
    }
});

export const {
    signupStart,
    signupSuccess,
    signupFailure,
    loginStart,
    loginSuccess,
    loginFailure,
    logOut} = authSlice.actions;

export default authSlice.reducer;