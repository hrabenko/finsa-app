import './BudgetEditor.sass';
import cancelIcon from '../../images/icons/cancel-icon.svg';
import {useEffect, useState} from "react";
import axios from "../../axios";
import {useSelector} from "react-redux";


function BudgetEditor({setCreatingBudget, formData, setFormData, actionFunction}) {
    const [chosenPeriod, setChosenPeriod] = useState("");
    const [anotherPeriod, setAnotherPeriod] = useState({
        period_start: "",
        period_end: ""
    });
    const [contributorsInput, setContributorsInput] = useState("");

    const {currentUser} = useSelector((state) => state.auth);

    function formatDate(dateString) {
        let [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    }

    const handlePeriodChange = (e) => {
        setChosenPeriod(e.target.value);
    }

    useEffect(() => {
        const date = new Date();
        const currentMonth = date.getMonth() + 1;
        const currentYear = date.getFullYear();

        if (chosenPeriod === "Поточний місяць") {
            const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
            setFormData((prevState) => ({
                ...prevState,
                period: chosenPeriod,
                period_start: `1.${currentMonth}.${currentYear}`,
                period_end: `${daysInMonth}.${currentMonth}.${currentYear}`
            }));
        } else if (chosenPeriod === "Наступний місяць") {
            let nextMonth = currentMonth + 1;
            let year = currentYear;

            if (nextMonth > 12) {
                nextMonth = 1;
                year = currentYear + 1;
            }

            const daysInNextMonth = new Date(year, nextMonth, 0).getDate();
            setFormData((prevState) => ({
                ...prevState,
                period: chosenPeriod,
                period_start: `1.${nextMonth}.${year}`,
                period_end: `${daysInNextMonth}.${nextMonth}.${year}`
            }));
        } else if (chosenPeriod === "Поточний рік") {
            setFormData((prevState) => ({
                ...prevState,
                period: chosenPeriod,
                period_start: `1.1.${currentYear}`,
                period_end: `31.12.${currentYear}`
            }));
        } else if (chosenPeriod === "Обрати період") {
            setFormData((prevState) => ({
                ...prevState,
                period: chosenPeriod,
                period_start: formatDate(anotherPeriod.period_start),
                period_end: formatDate(anotherPeriod.period_end)
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                period: null,
                period_start: null,
                period_end: null
            }));
        }
    }, [chosenPeriod, anotherPeriod]);

    const handleChange = (e) => {
        setFormData((prevState) => ({...prevState, [e.target.id]: e.target.value}));
    }
    const handleAnotherPeriodChange = (e) => {
        setAnotherPeriod((prevState) => ({...prevState, [e.target.id]: e.target.value}));
    }

    const handleAddContributor = async (e) => {
        e.preventDefault();
        if (formData.contributors.includes(contributorsInput)) {

        } else {
            try {
                const res = await axios.post(`/user/user-existing/${contributorsInput}`);
                const data = await res.data;
                if (res.status === 200 && data !== currentUser.id) {
                    setFormData((prevState) => ({
                        ...prevState,
                        contributors: [...prevState.contributors, contributorsInput]
                    }));
                    setContributorsInput('');
                }
            } catch (error) {
                const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
                alert(errorMessage);
            }
        }
    }

    const handleDeleteContributor = (contributor) => {
        setFormData((prevState) => ({
            ...prevState,
            contributors: prevState.contributors.filter(item => item !== contributor)
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        actionFunction();
    }

    return (
        <div className="creating">
            <form className="creating-form" onSubmit={handleSubmit}>
                <div className="input-control">
                    <label>Назва: </label>
                    <input type='text' value={formData.name} id="name" placeholder="Ввведіть назву" required
                           onChange={handleChange}/>
                </div>
                <div className="input-control">
                    <label>Період: </label>
                    <select value={formData.period && formData.period} onChange={handlePeriodChange}>
                        <option>-</option>
                        <option>Поточний місяць</option>
                        <option>Наступний місяць</option>
                        <option>Поточний рік</option>
                        <option>Обрати період</option>
                    </select>
                </div>
                <div className={chosenPeriod === "Обрати період"
                    ? `input-control choose-period`
                    : `input-control choose-period hidden`}>
                    <input id="period_start" value={anotherPeriod.period_start} type="date" onChange={handleAnotherPeriodChange}/>
                    <input id="period_end" value={anotherPeriod.period_end} type="date" onChange={handleAnotherPeriodChange}/>
                </div>
                <div className="input-control">
                    <label>Учасники: </label>
                    <div className='contributors-input'>
                        <input type="text" placeholder="Введіть ім'я користувача"
                               onChange={(e) => setContributorsInput(e.target.value)}/>
                        <button onClick={handleAddContributor}>Додати</button>
                    </div>
                    <div className='contributors-list'>
                        {formData.contributors && formData.contributors.map((item, index) => (
                            <div key={item}>
                                <p className='username'>{item}</p>
                                <img onClick={() => handleDeleteContributor(item)} src={cancelIcon}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="buttons">
                    <button className='btn btn-save' >Зберегти</button>
                    <button className='btn btn-cancel' onClick={() => setCreatingBudget(false)}>Скасувати</button>
                </div>
            </form>
        </div>
    )
}

export default BudgetEditor;