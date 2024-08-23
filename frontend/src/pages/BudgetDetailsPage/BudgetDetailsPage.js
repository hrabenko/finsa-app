import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import trashIcon from '../../images/icons/trash-icon-green.svg';
import editIcon from '../../images/icons/edit-icon-green.svg';
import Entries from '../../components/Entries/Entries';
import "./BudgetDetailsPage.sass";
import BudgetEditor from "../../components/BudgetEditor/BudgetEditor";
import {useSelector} from "react-redux";
import axios from "../../axios";
import Charts from "../../components/Charts/Charts";

function BudgetDetailsPage() {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        period_start: '',
        period_end: '',
        contributors: []
    });

    const [editingData, setEditingData] = useState(null);

    let { id } = useParams();
    const {currentUser} = useSelector((state) => state.auth);
    const {expensesData} = useSelector((state) => state.expenses);
    const {incomeData} = useSelector((state) => state.income);

    const fetchData = async () => {
        try {
            const res = await axios.get(`/budgets/budget/${id}`);
            const data = await res.data;
            if (res.status === 200) {
                setFormData({
                    name: data[0].name,
                    period: data[0].period,
                    period_start: data[0].period_start,
                    period_end: data[0].period_end,
                    contributors: data[0].contributors && data[0].contributors.split(", ")
                });
            }
        } catch (error) {
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

    const startUpdating = () => {
        setIsEditing(true);
        setEditingData(formData);
    }

    const handleUpdate = async (e) => {
        console.log("DJYJ", editingData);
        try {
            const res = await axios.post(`/budgets/budget/${id}`, {...editingData,
                contributors: editingData.contributors && editingData.contributors.join(", ")});
            if (res.status === 200) {
                setIsEditing(false);
                setFormData(editingData);
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`/budgets/budget/${id}`);
            if (res.status === 200) {
                navigate('/budgets')
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    return (
        <div className='budget-details'>
            <div className='main-info'>
                <div>
                    <h2 className='budget-name'>{formData.name}</h2>
                    {formData.period_start && <p className='budget-period'>{formData.period_start} - {formData.period_end}</p>}
                </div>
                <div className='icons'>
                    <img onClick={startUpdating} className='btn edit-btn' src={editIcon}/>
                    <img className='btn trash-btn' onClick={handleDelete} src={trashIcon}/>
                </div>
            </div>
            {isEditing && <BudgetEditor setCreatingBudget={setIsEditing}
                                        formData={editingData} setFormData={setEditingData} actionFunction={handleUpdate} />}
            <div className='entries-containers'>
                <div>
                    <h3>Витрати</h3>
                    <Entries mode={"expenses"} />
                </div>
                <div>
                    <h3>Доходи</h3>
                    <Entries mode={"income"} />
                </div>
                {(incomeData.length > 0 || expensesData.length > 0) && <Charts />}
            </div>
        </div>
    )
}

export default BudgetDetailsPage;