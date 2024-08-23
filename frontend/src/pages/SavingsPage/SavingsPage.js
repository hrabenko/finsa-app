import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import "./SavingsPage.sass";
import {useDispatch, useSelector} from "react-redux";
import {
    getSavingsDataStart,
    getSavingsDataSuccess,
    getSavingsDataFailure,
    updateSavingsStart,
    updateSavingsSuccess,
    updateSavingsFailure,
    deleteSavingsStart,
    deleteSavingsSuccess,
    deleteSavingsFailure,
    createSavingsStart,
    createSavingsSuccess,
    createSavingsFailure
} from '../../redux/slices/savings';
import axios from "../../axios";


function SavingsPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [savingsForm, setSavingsForm] = useState({});

    const {currentUser} = useSelector((state) => state.auth);
    const {loading, savingsData} = useSelector((state) => state.savings);

    const fetchData = async () => {
        dispatch(getSavingsDataStart())
        try {
            const res = await axios.get(`/savings/${currentUser.id}`);
            const data = await res.data;
            if (res.status === 200) {
                dispatch(getSavingsDataSuccess(data));
            }
        } catch (error) {
            dispatch(getSavingsDataFailure());
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    useEffect(() => {
        if (!currentUser) {
            navigate("/")
        }
        fetchData();
    }, []);

    const handleChange = (e) => {
        setSavingsForm((prevState) => ({...prevState, [e.target.id]: e.target.value}));
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        dispatch(createSavingsStart());
        const req = {...savingsForm, userId: currentUser.id};
        setSavingsForm({});
        try {
            const res = await axios.post(`/savings`, req);
            if (res.status === 200) {
                dispatch(createSavingsSuccess([...savingsData, {id: res.data, ...req}]));
                setIsCreating(false);
            }
        } catch (error) {
            dispatch(createSavingsFailure());
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    const handleDelete = async (e, index) => {
        e.preventDefault();
        dispatch(deleteSavingsStart());
        try {
            const res = await axios.delete(`/savings/${index}`);
            if (res.status === 200) {
                dispatch(deleteSavingsSuccess(savingsData.filter((item) => item.id === index)[0]));
            }
        } catch (error) {
            dispatch(deleteSavingsFailure());
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    const handleUpdatingStart = (id) => {
        setIsCreating(false);
        setEditingId(id);
        setSavingsForm(savingsData.filter((item) => item.id === id)[0]);
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        dispatch(updateSavingsStart());
        setEditingId(null);
        try {
            const res = await axios.post(`/savings/${savingsForm.id}`, savingsForm);
            if (res.status === 200) {
                dispatch(updateSavingsSuccess(savingsForm));
                setSavingsForm({});
            }
        } catch (error) {
            dispatch(updateSavingsFailure());
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    return (
        <div className="savings">
            <h2 className="savings-title">Заощадження</h2>
            {loading ? "Завантаження..." : <table className="savings-table">
                <tbody>
                {Array.isArray(savingsData) && savingsData.map((item) => (
                    <tr key={item.id}>
                    {item.id === editingId ? (
                        <>
                            <td className="title">
                                <input id='name' type="text" value={savingsForm.name} onChange={handleChange}
                                       placeholder="Назва" />
                            </td>
                            <td>
                                <select id="category" value={savingsForm.category} onChange={handleChange} >
                                    <option>Готівка</option>
                                    <option>Картка</option>
                                    <option>Інше</option>
                                </select>
                            </td>
                            <td className="value-input">
                                <input id="value" type="text" value={savingsForm.value} onChange={handleChange}
                                placeholder="Сума" />
                            </td>
                            <td className="currency-input">
                                <input id="currency" type="text" value={savingsForm.currency} onChange={handleChange}
                                placeholder="Валюта" />
                            </td>
                            <td>
                                <button className="btn btn-save" onClick={handleUpdate}>
                                    Зберегти
                                </button>
                            </td>
                            <td>
                                <button className="btn btn-cancel" onClick={() => {
                                    setSavingsForm({})
                                    setEditingId(null);
                                }}>
                                    Скасувати
                                </button>
                            </td>
                        </>) : (<>
                            <td className="title">{item.name}</td>
                            <td className="category">
                                <div>{item.category}</div>
                            </td>
                            <td className="value">{item.value}</td>
                            <td className="currency">{item.currency}</td>
                            <td>
                                <button className="btn btn-edit" onClick={() => {handleUpdatingStart(item.id)}}>
                                    Редагувати
                                </button>
                            </td>
                            <td>
                                <button className="btn btn-delete"
                                        onClick={(e) => handleDelete(e, item.id)}>
                                    Видалити
                                </button>
                            </td>
                        </>)}
                </tr>))}
                {isCreating ? <tr>
                    <td className="title">
                        <input id='name' type="text" value={savingsForm.name} onChange={handleChange}
                               placeholder="Назва"/>
                    </td>
                    <td>
                        <select id="category" value={savingsForm.category} onChange={handleChange}>
                            <option>Готівка</option>
                            <option>Картка</option>
                            <option>Інше</option>
                        </select>
                    </td>
                    <td className="value-input">
                        <input id="value" type="text" value={savingsForm.value} onChange={handleChange}
                               placeholder="Сума"/>
                    </td>
                    <td className="currency-input">
                        <input id="currency" type="text" value={savingsForm.currency} onChange={handleChange}
                               placeholder="Валюта"/>
                    </td>
                    <td>
                        <button className="btn btn-save" onClick={handleCreate}>Зберегти</button>
                    </td>
                    <td>
                        <button className="btn btn-cancel" onClick={() => {
                            setIsCreating(false)
                            setSavingsForm({})
                        }}>
                            Скасувати
                        </button>
                    </td>
                </tr> : <tr>
                    <td colSpan={6}>
                        <button className="btn-add" onClick={() => {
                            setEditingId(null)
                            setSavingsForm({})
                            setIsCreating(true)
                        }}>
                            Додати заощадження
                        </button>
                    </td>
                </tr>}
                </tbody>
            </table>}
        </div>)
}

export default SavingsPage;