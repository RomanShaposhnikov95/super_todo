import './Lists.css';
import {TodoItem} from "../TodoItem/TodoItem";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {changeTodosArr, fetchTodos, todoChecked, todoDeleted} from "../../redux/todoSlice";
import {Preloader} from "../Preloader/Preloader";
import {useHttp} from "../../hooks/http.hook";
import {motion,AnimatePresence} from "framer-motion";


export const Lists = () => {

    const dispatch = useDispatch()
    const {request} = useHttp()
    let {todos,todosLoadingStatus} = useSelector(state => state.todos)
    const {activeFilter, value} = useSelector(state => state.filters)
    const [todosArrChange,setTodArrChange] = useState(todos)
    const [currentCard,setCurrentCard] = useState(null )

    useEffect(() => {
        setTodArrChange(todos)
    },[todos])

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/todos/${id}`,'DELETE')
            .then(dispatch(todoDeleted(id)))
    },[request])

    const onChangeStatus = useCallback((id) => {
        const todo = todosArrChange.find(el => el.id === id)
        request(`http://localhost:3001/todos/${id}`,'PATCH', JSON.stringify({completed: !todo.completed}))
            .then(dispatch(todoChecked(id)))
    },[request])

    useEffect(() => {
        dispatch(fetchTodos())
    },[])

    if (todosLoadingStatus === 'loading') {
        return <Preloader/>
    } else if (todosLoadingStatus === 'error') {
        return <h1 className='error-text'>Ошибка загрузки</h1>
    }

    const renderTodoList = (todoArr) => {
        if (todoArr.length === 0) {
            return (
                <h1 className='empty'>Пока нет ни одной записи</h1>
            )
        }

        //------------------------------------------------------------------------------------------

        const dragStartHandler = (e,card) => {
            setCurrentCard(card)
        }
        const dragEndHandler = (e) => {
            e.target.style.background = 'white'
            const promises = todosArrChange.map(el => {
                request(`http://localhost:3001/todos/${el.id}`,'PUT',JSON.stringify({
                    ...el
                }))
            })

            Promise.all(promises)
                .then(dispatch(changeTodosArr(todosArrChange)))
        }
        const dragOverHandler = (e) => {
            e.preventDefault()
            e.target.style.background = 'lightgray'
        }
        const dragDropHandler = (e,card) => {
            e.preventDefault()
            setTodArrChange(todosArrChange.map(c => {
                if (c.id === card.id) {
                    return {...c, order: currentCard.order}
                }
                if (c.id === currentCard.id) {
                    return {...c, order: card.order}
                }
                return c
            }))
            e.target.style.background = 'white'
        }

        const sortCards = (a,b) => {
            if (a.order > b.order) {
                return 1
            } else {
                return -1
            }
        }

        //------------------------------------------------------------------------------------------

        return todoArr.sort(sortCards).map(el => (
               <AnimatePresence key={el.id}>
                   <motion.div
                   initial={{opacity: 0}}
                   animate={{opacity: 1}}
                   exit={{opacity : 0}}
                   transition={{duration: 0.4}}>
                       <div className='card'
                            onDragStart={(e) => dragStartHandler(e,el)}
                            onDragLeave={(e) => dragEndHandler(e)}
                            onDragEnd={(e) => dragEndHandler(e)}
                            onDragOver={(e) => dragOverHandler(e)}
                            onDrop={(e) => dragDropHandler(e,el)}
                            draggable={true}>
                           <TodoItem {...el}
                                     onDelete={() => onDelete(el.id)}
                                     onChangeStatus={() => onChangeStatus(el.id)}
                           />
                       </div>
                   </motion.div>
               </AnimatePresence>
        ))
    }

    let copyTodo = todosArrChange.filter(el => {
        if(activeFilter.includes('all' || '')) return el

        let isTrue = false

        activeFilter.forEach(col => {
            if(el.color.includes(col)) isTrue = true
        })

        return isTrue
    })

    let copyTwoTodo = copyTodo

    if(value === 'active') {
        copyTwoTodo = copyTodo.filter(el => el.completed === false)
    }
    if(value === 'completed') {
        copyTwoTodo = copyTodo.filter(el => el.completed === true)
    }

    const elements = renderTodoList(copyTwoTodo)

    return (
        <div className='listBlock'>
            {elements}
        </div>
    )
}