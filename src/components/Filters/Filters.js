import './Filters.css';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchFilters, filterByBoolean, filterChanged, todoCount} from "../../redux/filterSlice";
import {allChecked, allDelete} from "../../redux/todoSlice";
import {useHttp} from "../../hooks/http.hook";
import {Preloader} from "../Preloader/Preloader";


export const Filters = () => {
    const dispatch = useDispatch()
    const {filters,count,filtersLoadingStatus,activeFilter,value} = useSelector(state => state.filters)
    const todos = useSelector(state => state.todos.todos)
    const {request} = useHttp()
    const [disabled, setDisabled ] = useState(false)



    useEffect(() => {
        dispatch(fetchFilters())
    },[])


    useEffect(() => {
        dispatch(todoCount(todos.length))
    })

    const onChangeStatus = () => {
        setDisabled(true)
        const promises = todos.map(el => {
            return request(`http://localhost:3001/todos/${el.id}`,'PUT', JSON.stringify({
                ...el,
                completed: true
            }))
        })

        Promise.all(promises)
            .then(() => {
                dispatch(allChecked())
            })
            .catch(() => {
                console.log('error');
            })
            .finally(() => {
                setDisabled(false)
            })
    }

    const onAllDelete = () => {
        const promises = todos.map(el => {
            if(el.completed !== true) return
            request(`http://localhost:3001/todos/${el.id}`,'DELETE')
        })

        Promise.all(promises)
            .then(dispatch(allDelete()))
    }

    const renderColorValue = (filters, status) => {
        if (status === 'loading') {
            return <Preloader/>
        } else if (status === "error") {
            return <p>Ошибка загрузки</p>
        }

        if (filters && filters.length > 0 ) {
            return filters.map(el => {


                const filterHandler = (key) => {
                    dispatch(filterChanged(key))
                }

                return (
                    <div key={el.color} className="color">
                        <input checked={activeFilter.includes(el.color)} onChange={() => filterHandler(el.color)} type="checkbox"/>
                        <p>{el.color}</p>
                    </div>
                )
            })
        }
    }

    const elements = renderColorValue(filters,filtersLoadingStatus)

    const filterHandler = (key) => {
        dispatch(filterChanged(key))
    }

    const changeFilterValue = (val) => {
        dispatch(filterByBoolean(val))
    }

    return (
        <div className='filters'>
            <div className="checkAll">
                <button onClick={onChangeStatus} className='AllCompleted' disabled={disabled}>Сделать все выполненными</button>
                <button onClick={onAllDelete} className='AllCompleted'>Удалить все выполненные</button>
            </div>
            <div className="totalCount">Всего: {count}</div>
            <div className="filterByCheckbox">
                <button onClick={() => changeFilterValue('all')} className={value === 'all' ? "filterBtn active" : "filterBtn"}>all</button>
                <button onClick={() => changeFilterValue('active')} className={value === 'active' ? "filterBtn active" : "filterBtn"}>active</button>
                <button onClick={() => changeFilterValue('completed')} className={value === 'completed' ? "filterBtn active" : "filterBtn"}>completed</button>
            </div>
            <div className="filtersByColor">
                <div className="color">
                    <input checked={activeFilter.includes('all')} onChange={() => filterHandler('all')} type="checkbox"/>
                    <p>all</p>
                </div>
                {elements}
            </div>
        </div>
    )
}