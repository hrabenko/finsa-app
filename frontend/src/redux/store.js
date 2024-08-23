import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.js';
import savingsReducer from './slices/savings.js';
import budgetsReducer from './slices/budgets.js';
import incomeReducer from './slices/income.js';
import expensesReducer from './slices/expenses.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    auth: authReducer,
    savings: savingsReducer,
    budgets: budgetsReducer,
    income: incomeReducer,
    expenses: expensesReducer
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);