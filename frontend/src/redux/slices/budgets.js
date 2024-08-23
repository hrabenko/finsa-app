import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: null,
    budgetsData: []
};

const budgetsSlice = createSlice({
    name: 'budgets',
    initialState,
    reducers: {
        getBudgetDataStart: (state, action) =>{
            state.loading = true;
        },
        getBudgetDataSuccess: (state, action) =>{
            state.loading = false;
            state.budgetsData = action.payload;
        },
        getBudgetDataFailure: (state, action) =>{
            state.loading = false;
        },
        createBudgetStart: (state, action) => {
            state.loading = true;
        },
        createBudgetSuccess: (state, action) => {
            state.loading = false;
            state.budgetsData = action.payload;
        },
        createBudgetFailure: (state, action) => {
            state.loading = false;
        }
    }
});

export const {
    getBudgetDataStart,
    getBudgetDataSuccess,
    getBudgetDataFailure,
    createBudgetStart,
    createBudgetSuccess,
    createBudgetFailure
} = budgetsSlice.actions;

export default budgetsSlice.reducer;