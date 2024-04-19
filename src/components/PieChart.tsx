import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


export function PieChart({ expenseData, expenseLabels }: { expenseData: number[], expenseLabels: string[] }) {
    const data = {
        labels: expenseLabels,
        datasets: [
            {
                label: 'Expense Amount: Rs',
                data: expenseData,
                backgroundColor: ['#f9aec4', '#c6f2a4', '#333333', "#FFC774", "#b1c5fa"],
                borderColor: [
                    'rgba(162, 235, 110)',
                    'rgba(225, 217, 110)',
                    'rgba(225, 178, 110)',
                    'rgba(110, 204, 225)',
                    'rgba(225, 110, 127)'
                ],
                borderWidth: 1,
            },
        ],
    };
    return <Pie height={200} className='max-h-[20rem]' data={data} />;
}
