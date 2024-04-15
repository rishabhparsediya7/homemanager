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
                backgroundColor: [
                    'rgba(192, 255, 140)',
                    'rgba(255, 247, 140)',
                    'rgba(255, 208, 140)',
                    'rgba(140, 234, 255)',
                    'rgba(255, 140, 157)',

                ],
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
