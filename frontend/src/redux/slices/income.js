import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: null,
    incomeData: []
};

const incomeSlice = createSlice({
    name: 'income',
    initialState,
    reducers: {
        getIncomeDataStart: (state, action) =>{
            state.loading = true;
        },
        getIncomeDataSuccess: (state, action) =>{
            state.incomeData = action.payload;
            state.loading = false;
        },
        getIncomeDataFailure: (state, action) =>{
            state.loading = false;
        },
        updateIncomeStart: (state, action) => {
            state.loading = true;
        },
        updateIncomeSuccess: (state, action) => {
            state.loading = false;
            state.incomeData = state.incomeData.map((item) =>
                item.id === action.payload.id ? action.payload : item
            );
        },
        updateIncomeFailure: (state, action) => {
            state.loading = false;
        },
        deleteIncomeStart: (state, action) => {
            state.loading = true;
        },
        deleteIncomeSuccess: (state, action) => {
            state.loading = false;
            state.incomeData = state.incomeData.filter((item) => item.id !== action.payload.id);
        },
        deleteIncomeFailure: (state, action) => {
            state.loading = false;
        },
        createIncomeStart: (state, action) => {
            state.loading = true;
        },
        createIncomeSuccess: (state, action) => {
            state.loading = false;
            state.incomeData = action.payload;
        },
        createIncomeFailure: (state, action) => {
            state.loading = false;
        },
    }
});

export const {
    getIncomeDataStart,
    getIncomeDataSuccess,
    getIncomeDataFailure,
    updateIncomeStart,
    updateIncomeSuccess,
    updateIncomeFailure,
    deleteIncomeStart,
    deleteIncomeSuccess,
    deleteIncomeFailure,
    createIncomeStart,
    createIncomeSuccess,
    createIncomeFailure
} = incomeSlice.actions;

export default incomeSlice.reducer;