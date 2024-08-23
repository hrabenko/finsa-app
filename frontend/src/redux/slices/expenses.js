import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: null,
    expensesData: []
};

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        getExpensesDataStart: (state, action) =>{
            state.loading = true;
        },
        getExpensesDataSuccess: (state, action) =>{
            state.expensesData = action.payload;
            state.loading = false;
        },
        getExpensesDataFailure: (state, action) =>{
            state.loading = false;
        },
        updateExpensesStart: (state, action) => {
            state.loading = true;
        },
        updateExpensesSuccess: (state, action) => {
            state.loading = false;
            state.expensesData = state.expensesData.map((item) =>
                item.id === action.payload.id ? action.payload : item
            );
        },
        updateExpensesFailure: (state, action) => {
            state.loading = false;
        },
        deleteExpensesStart: (state, action) => {
            state.loading = true;
        },
        deleteExpensesSuccess: (state, action) => {
            state.loading = false;
            state.expensesData = state.expensesData.filter((item) => item.id !== action.payload.id);
        },
        deleteExpensesFailure: (state, action) => {
            state.loading = false;
        },
        createExpensesStart: (state, action) => {
            state.loading = true;
        },
        createExpensesSuccess: (state, action) => {
            state.loading = false;
            state.expensesData = action.payload;
        },
        createExpensesFailure: (state, action) => {
            state.loading = false;
        },
    }
});

export const {
    getExpensesDataStart,
    getExpensesDataSuccess,
    getExpensesDataFailure,
    updateExpensesStart,
    updateExpensesSuccess,
    updateExpensesFailure,
    deleteExpensesStart,
    deleteExpensesSuccess,
    deleteExpensesFailure,
    createExpensesStart,
    createExpensesSuccess,
    createExpensesFailure
} = expensesSlice.actions;

export default expensesSlice.reducer;