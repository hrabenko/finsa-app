import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";

function PieChart ({label, labels, dataset}) {
    const data = {
        labels: labels,
        datasets: [
            {
                label: label,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)',
                    'rgb(201, 203, 207)',
                    'rgb(255, 99, 71)',
                    'rgb(123, 239, 178)',
                    'rgb(60, 179, 113)',
                    'rgb(100, 149, 237)',
                    'rgb(255, 69, 0)',
                    'rgb(240, 128, 128)',
                ],
                hoverOffset: 4,
                radius: 150,
                data: dataset,
            },
        ],
    };
    return (
        <div className="pie-chart">
            <h3>{label}</h3>
            <Pie data={data}/>
        </div>
    )
}

export default PieChart;