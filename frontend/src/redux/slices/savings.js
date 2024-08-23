import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: null,
    savingsData: []
};

const savingsSlice = createSlice({
    name: 'savings',
    initialState,
    reducers: {
        getSavingsDataStart: (state, action) =>{
            state.loading = true;
        },
        getSavingsDataSuccess: (state, action) =>{
            state.savingsData = action.payload;
            state.loading = false;
        },
        getSavingsDataFailure: (state, action) =>{
            state.loading = false;
        },
        updateSavingsStart: (state, action) => {
            state.loading = true;
        },
        updateSavingsSuccess: (state, action) => {
            state.loading = false;
            state.savingsData = state.savingsData.map((item) =>
                item.id === action.payload.id ? action.payload : item
            );
        },
        updateSavingsFailure: (state, action) => {
            state.loading = false;
        },
        deleteSavingsStart: (state, action) => {
            state.loading = true;
        },
        deleteSavingsSuccess: (state, action) => {
            state.loading = false;
            state.savingsData = state.savingsData.filter((item) => item.id !== action.payload.id);
        },
        deleteSavingsFailure: (state, action) => {
            state.loading = false;
        },
        createSavingsStart: (state, action) => {
            state.loading = true;
        },
        createSavingsSuccess: (state, action) => {
            state.loading = false;
            state.savingsData = action.payload;
        },
        createSavingsFailure: (state, action) => {
            state.loading = false;
        },
    }
});

export const {
    getSavingsDataStart,
    getSavingsDataSuccess,
    getSavingsDataFailure,
    updateSavingsStart,
    updateSavingsSuccess,
    updateSavingsFailure,
    deleteSavingsStart,
    deleteSavingsSuccess,
    deleteSavingsFailure,
    createSavingsStart,
    createSavingsSuccess,
    createSavingsFailure
} = savingsSlice.actions;

export default savingsSlice.reducer;