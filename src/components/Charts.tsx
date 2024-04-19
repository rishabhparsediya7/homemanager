import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            labels: {
                font: {
                    size: 20,
                    family: '"Lato", sans-serif'
                }
            },
            position: 'top' as const,
            cornerRadius: 10,
        },
        tooltip: {
            cornerRadius: 20
        },
        title: {
            display: true,
            text: 'Home Manager Expense Charts',
        },
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: false,
            },
            ticks: {
                color: "#8c8c8b",
                font: {
                    size: 12,
                    weight: "500",
                },
                padding: 0,
            },
        },
        y: {
            display: true,
            grid: {
                display: false,
                color: "#ececec",
            },
            ticks: {
                color: "#8c8c8b",
                font: {
                    size: 12,
                    weight: "500",
                },
                padding: 6,
            },
        },
    },
};

type DataListProps = {
    label: string,
    data: number[],
    backgroundColor: string[],
    borderRadius: number
}
interface Props {
    labels: string[],
    datasets: DataListProps[]
}
export function Charts({ dataList }: { dataList: Props }) {
    return <Bar height={200} className='max-h-[20rem]' options={options} data={dataList} />;
}
