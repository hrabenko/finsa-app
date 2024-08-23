import {useEffect, useState} from "react";
import "./BudgetsPage.sass";
import {Link, useNavigate} from "react-router-dom";
import BudgetEditor from "../../components/BudgetEditor/BudgetEditor";
import {useDispatch, useSelector} from "react-redux";
import {
    getBudgetDataStart,
    getBudgetDataSuccess,
    getBudgetDataFailure,
    createBudgetStart,
    createBudgetSuccess,
    createBudgetFailure
} from '../../redux/slices/budgets';
import axios from "../../axios";

function BudgetsPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [creatingBudget, setCreatingBudget] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        period_start: '',
        period_end: '',
        period: '',
        contributors: []
    });

    const {currentUser} = useSelector((state) => state.auth);
    const {loading, budgetsData} = useSelector((state) => state.budgets);

    const fetchData = async () => {
        dispatch(getBudgetDataStart())
        try {
            const res = await axios.get(`/budgets/${currentUser.id}`);
            const data = await res.data;
            if (res.status === 200) {
                dispatch(getBudgetDataSuccess(data));
            }
        } catch (error) {
            dispatch(getBudgetDataFailure());
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

    const handleCreate = async () => {
        dispatch(createBudgetStart());
        try {
            console.log(formData);
            const res = await axios.post(    `/budgets`, {...formData,
                contributors: formData.contributors.join(", "), userId: currentUser.id});
            const data = await res.data;
            if (res.status === 200) {
                dispatch(createBudgetSuccess([...budgetsData, {id: data, ...formData}]));
                setCreatingBudget(false);
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            dispatch(createBudgetFailure({message: errorMessage}));
        }
    }

    return (
        <div className="budgets">
            <h2 className="budgets-title">Бюджети</h2>
            <div className="budgets-list">
                {loading ? "Завантаження..." : (Array.isArray(budgetsData) && budgetsData.map((item) => (
                    <Link to={`${item.id}`} key={item.id}>
                        <div className="budget">
                            <div className="budget-main-info">
                                    <h3 className="budget-name">{item.name}</h3>
                                {item.period_start &&
                                    <p className="budget-period">{`${item.period_start} - ${item.period_end}`}</p>}
                            </div>
                            <div className="budget-expenses-income">
                                <p>Витрати: <span className="expenses">{item.expenses ? item.expenses : "0"} {currentUser && currentUser.currency}</span></p>
                                <p>Доходи: <span className="income">{item.income ? item.income : "0"} {currentUser && currentUser.currency}</span></p>
                            </div>
                        </div>
                    </Link>
                )))}
            </div>
            <button onClick={() => setCreatingBudget(true)} className="btn-create">
                Створити бюджет
            </button>
            {creatingBudget && <BudgetEditor setCreatingBudget={setCreatingBudget}
                                             formData={formData} setFormData={setFormData} actionFunction={handleCreate} />}
        </div>
    )
}

export default BudgetsPage;