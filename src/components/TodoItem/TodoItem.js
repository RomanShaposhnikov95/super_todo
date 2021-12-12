import '../Lists/Lists.css'
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {useHttp} from "../../hooks/http.hook";
import {todoColorChange} from "../../redux/todoSlice";


export const TodoItem = (props) => {
    const {id,title,name,color,completed,onDelete,onChangeStatus} = props
    const {filters,filtersLoadingStatus} = useSelector(state => state.filters)
    const [colorValue,setColorValue] = useState(color)
    const {request} = useHttp()
    const dispatch = useDispatch()

    const renderFilters = (filters,status) => {
        if (status === 'loading') {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0 ) {
            return filters.map(el => <option key={el.color} value={el.color}>{el.color}</option>)
        }
    }

    const toggleStatus = (e) => {
        setColorValue(e.target.value)
        const res = e.target.value
        request(`http://localhost:3001/todos/${id}`,'PATCH', JSON.stringify({color: res}))
            .then(dispatch(todoColorChange({id, res})))
    }

    return (
        <div className="listItem">
            <div className="checkbox">
                <input onChange={onChangeStatus} checked={completed} className="custom-checkbox" type="checkbox" id={id}/>
                <label htmlFor={id}></label>
            </div>
            <p className='text'>{title}</p>
            <div className='val'>
                <select className='opt' value={colorValue} onChange={toggleStatus}>
                    <option value=""></option>
                    {renderFilters(filters,filtersLoadingStatus)}
                </select>
                <button onClick={onDelete} className='removeBtn'>&#10006;</button>
            </div>
        </div>
    )
}