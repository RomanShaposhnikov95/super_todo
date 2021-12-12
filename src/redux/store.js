import {configureStore} from "@reduxjs/toolkit";
import todoReducer from './todoSlice';
import filterReducer from './filterSlice'

const store = configureStore({
    reducer: {
        todos: todoReducer,
        filters: filterReducer
    }
})

window.store = store

export default store;