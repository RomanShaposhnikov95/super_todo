import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "../hooks/http.hook";


export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async () => {
        const {request} = useHttp();
        return await request("http://localhost:3001/todos")
    }
)

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        todosLoadingStatus: 'null'
    },
    reducers: {
        todoCreated: (state,action) => {
            state.todos.push(action.payload)
        },
        todoDeleted: (state,action) => {
            state.todos = state.todos.filter(el => el.id !== action.payload)
        },
        todoChecked: (state,action) => {
            const toggleTodo = state.todos.find(el => el.id === action.payload)
            toggleTodo.completed = !toggleTodo.completed
        },
        todoColorChange: (state,action) => {
            const toggleColor = state.todos.find(el => el.id === action.payload.id)
            toggleColor.color = action.payload.res
        },
        allChecked: (state, action) => {
            state.todos = state.todos.filter(el => el.completed = true)
        },
        allDelete: (state,action) => {
            state.todos = state.todos.filter(el => el.completed !== true)
        },
        changeTodosArr: (state, action) => {
            state.todos = action.payload
        }
    },
    extraReducers: {
        [fetchTodos.pending]: (state) => {state.todosLoadingStatus = 'loading'},
        [fetchTodos.fulfilled]: (state,action) => {
            state.todosLoadingStatus = 'null';
            state.todos = action.payload;
        },
        [fetchTodos.rejected]: (state) => {state.todosLoadingStatus = 'error'}
    }
})

export const {todoCreated,todoDeleted,todoChecked,todoColorChange,allChecked,allDelete,changeTodosArr} = todoSlice.actions

export default todoSlice.reducer

