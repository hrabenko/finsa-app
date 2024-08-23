import {useSelector} from "react-redux";
import PieChart from "./PieChart";
import './Charts.sass';
import {useEffect, useState} from "react";

function Charts () {
    const [income, setIncomes] = useState({});
    const [expenses, setExpenses] = useState({});

    const {incomeData} = useSelector((state) => state.income);
    const {expensesData} = useSelector((state) => state.expenses);

    const getChartsData = (data) => {
        let categories = [];
        let values = [];
        for (let i = 0; i < data.length; i++) {
            if (categories.includes(data[i].category)) {
                const index = categories.indexOf(data[i].category);
                values[index] += data[i].value;
            } else {
                categories.push(data[i].category);
                values.push(data[i].value);
            }
        }
        return {categories, values};
    }

    useEffect(() => {
        const incomeCharts = getChartsData(incomeData);
        const expensesCharts = getChartsData(expensesData);
        setIncomes(incomeCharts);
        setExpenses(expensesCharts);

    }, [incomeData, expensesData]);

    return (
        <div className="charts">
            {income && <PieChart label={"Доходи"} labels={income.categories} dataset={income.values}/>}
            {expenses && <PieChart label={"Витрати"} labels={expenses.categories} dataset={expenses.values}/>}
        </div>
    )
}

export default Charts;