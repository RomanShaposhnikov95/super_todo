import './Input.css'
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import v1 from "uuid";
import {useHttp} from "../../hooks/http.hook";
import {todoCreated} from "../../redux/todoSlice";


export const Input = () => {

    const dispatch = useDispatch();
    const [value,setValue] = useState('');
    const {request} = useHttp()
    const todos = useSelector(state => state.todos.todos)

    const onSubmitHandler = () => {
        if (!value) return;

        const newTodo = {
            id: v1(),
            title: value,
            name: 'Roma',
            color: '',
            completed: false,
            order: todos.length + 1
        }

        request('http://localhost:3001/todos', 'POST', JSON.stringify(newTodo))
            .then(dispatch(todoCreated(newTodo)))
        setValue('')
    }

    return (
        <div className='inputBlock'>
            <input required value={value} onChange={(e) => setValue(e.target.value)} placeholder='Добавить текст' type="text" className='inputText'/>
            <button onClick={onSubmitHandler} className="inputBtn">Добавить</button>
        </div>
    )
}