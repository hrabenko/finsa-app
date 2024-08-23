import {useState, useEffect} from "react";
import trashIcon from '../../images/icons/trash-icon-green.svg';
import editIcon from '../../images/icons/edit-icon-green.svg';
import saveIcon from '../../images/icons/save-icon.svg';
import cancelIcon from '../../images/icons/cancel-icon.svg';
import './Entries.sass';
import axios from "../../axios";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    getIncomeDataStart, getIncomeDataSuccess, getIncomeDataFailure,
    updateIncomeStart, updateIncomeSuccess, updateIncomeFailure,
    deleteIncomeStart, deleteIncomeSuccess, deleteIncomeFailure,
    createIncomeStart, createIncomeSuccess, createIncomeFailure
} from '../../redux/slices/income';
import {
    getExpensesDataStart, getExpensesDataSuccess, getExpensesDataFailure,
    updateExpensesStart, updateExpensesSuccess, updateExpensesFailure,
    deleteExpensesStart, deleteExpensesSuccess, deleteExpensesFailure,
    createExpensesStart, createExpensesSuccess, createExpensesFailure
} from '../../redux/slices/expenses';

const Entries = ({mode}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { currentUser } = useSelector((state) => state.auth);
    const { incomeData } = useSelector((state) => state.income);
    const { expensesData } = useSelector((state) => state.expenses);

    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);



    const [entriesForm, setEntriesForm] = useState({
        category: mode === "income" ? "Їжа та напої" : "Зарплатня", value: '', notes: ''
    });

    const expensesCategories = ["Їжа та напої", "Здоров'я", "Спорт", "Комунальні послуги", "Дім",
        "Одяг та взуття", "Освіта", "Розваги", "Благодійність", "Подарунки", "Транспорт", "Сім'я",
        "Кредити", "Перекази", "Інвестиції", "Покупки", "Інше"];
    const incomeCategories = ["Зарплатня", "Перекази", "Депозити", "Інше"];
    const categories = mode === "income" ? incomeCategories : expensesCategories;

    const actions = {
        income: {
            start: getIncomeDataStart, success: getIncomeDataSuccess, failure: getIncomeDataFailure,
            createStart: createIncomeStart, createSuccess: createIncomeSuccess, createFailure: createIncomeFailure,
            updateStart: updateIncomeStart, updateSuccess: updateIncomeSuccess, updateFailure: updateIncomeFailure,
            deleteStart: deleteIncomeStart, deleteSuccess: deleteIncomeSuccess, deleteFailure: deleteIncomeFailure
        },
        expenses: {
            start: getExpensesDataStart, success: getExpensesDataSuccess, failure: getExpensesDataFailure,
            createStart: createExpensesStart, createSuccess: createExpensesSuccess, createFailure: createExpensesFailure,
            updateStart: updateExpensesStart, updateSuccess: updateExpensesSuccess, updateFailure: updateExpensesFailure,
            deleteStart: deleteExpensesStart, deleteSuccess: deleteExpensesSuccess, deleteFailure: deleteExpensesFailure
        }
    };

    const fetchData = async () => {
        dispatch(actions[mode].start());
        try {
            const res = await axios.get(`/${mode}/${id}`);
            const data = await res.data;
            if (res.status === 200) {
                dispatch(actions[mode].success(data));
            }
        } catch (error) {
            dispatch(actions[mode].failure());
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    };

    useEffect(() => {
        if (!currentUser) navigate("/");
        fetchData();
    }, []);

    const handleChange = (e) => {
        setEntriesForm((prevState) => ({...prevState, [e.target.id]: e.target.value}));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        dispatch(actions[mode].createStart());
        const req = {...entriesForm, budgetId: id};
        console.log("REQ", req)
        setEntriesForm({});
        try {
            const res = await axios.post(`/${mode}`, req);
            if (res.status === 200) {
                dispatch(actions[mode].createSuccess([...mode === "income" ? incomeData : expensesData,
                    {id: res.data, ...req}]));
                setIsCreating(false)
            }
        } catch (error) {
            dispatch(actions[mode].createFailure());
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    };

    const handleUpdatingStart = (id) => {
        setIsCreating(false);
        setEditingId(id);
        setEntriesForm((mode === 'income' ? incomeData : expensesData)
            .filter((item) => item.id === id)[0]);
    }

    const handleUpdate = async () => {
        dispatch(actions[mode].updateStart());
        setEditingId(null);
        try {
            const res = await axios.post(`/${mode}/${entriesForm.id}`, entriesForm);
            if (res.status === 200) {
                dispatch(actions[mode].updateSuccess(entriesForm));
                setEntriesForm({});
            }
        } catch (error) {
            dispatch(actions[mode].updateFailure());
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        dispatch(actions[mode].deleteStart());
        try {
            const res = await axios.delete(`/${mode}/${id}`);
            if (res.status === 200) {
                dispatch(actions[mode].deleteSuccess((mode === 'income' ? incomeData : expensesData)
                    .filter((item) => item.id === id)[0]));
            }
        } catch (error) {
            dispatch(actions[mode].deleteFailure());
            const errorMessage = error.response?.data || 'Щось пішло не так!';
            alert(errorMessage);
        }
    };

    return (
        <table className="entries">
            <thead>
            <tr>
                <td>Категорія</td>
                <td>Сума</td>
                <td>Нотатки</td>
            </tr>
            </thead>
            <tbody>
            {(mode === "income" ? incomeData : expensesData)?.map((item) => (
                <tr key={item.id}>
                    {item.id === editingId ? (
                        <>
                            <td className='category'>
                                <select id="category" value={entriesForm.category} onChange={handleChange}>
                                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </td>
                            <td className='value'>
                                <input id="value" value={entriesForm.value} onChange={handleChange} type="text"/>
                            </td>
                            <td className='notes'>
                                <input id="notes" value={entriesForm.notes} onChange={handleChange} type="text"/>
                            </td>
                            <td className="btn"><img onClick={handleUpdate} className="save-btn" src={saveIcon}/></td>
                            <td className="btn"><img onClick={() => {
                                setEditingId(null)
                                setEntriesForm({})
                            }} className="cancel-btn" src={cancelIcon}/></td>
                        </>
                    ) : (
                        <>
                            <td className='category'>{item.category}</td>
                            <td className='value'>{item.value} {currentUser.currency}</td>
                            <td className='notes'>{item.notes}</td>
                            <td className="btn"><img onClick={() => {handleUpdatingStart(item.id)}} className="edit-btn" src={editIcon}/></td>
                            <td className="btn"><img onClick={() => handleDelete(item.id)} className="trash-btn" src={trashIcon}/></td>
                        </>
                    )}
                </tr>
            ))}
            {isCreating ? (
                <tr>
                    <td className='category'>
                        <select id="category" value={entriesForm.category} onChange={handleChange}>
                            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </td>
                    <td className='value'>
                        <input id="value" type="text" value={entriesForm.value} onChange={handleChange}/>
                    </td>
                    <td className='notes'>
                        <input id="notes" value={entriesForm.notes} onChange={handleChange} type="text"/>
                    </td>
                    <td className="btn"><img onClick={handleCreate} className="save-btn" src={saveIcon}/></td>
                    <td className="btn"><img onClick={() => {
                        setIsCreating(false)
                        setEntriesForm({})
                    }} className="cancel-btn" src={cancelIcon}/></td>
                </tr>
            ) : (
                <tr>
                    <td colSpan={3}>
                        <button className="btn-add" onClick={() => {
                            setEditingId(null)
                            setEntriesForm({})
                            setIsCreating(true)
                        }}>Додати</button>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default Entries;
