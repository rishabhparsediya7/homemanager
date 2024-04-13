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
                    size: 18,
                    family: '"Lato", sans-serif'
                }
            },
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Home Manager Expense Charts',
        },
    },
};

type DataListProps = {
    label: string,
    data: number[],
    backgroundColor: string,
}
interface Props {
    labels: string[],
    datasets: DataListProps[]
}
export function Charts({ dataList }: { dataList: Props }) {
    return <Bar height={200} className='max-h-[20rem]' options={options} data={dataList} />;
}
