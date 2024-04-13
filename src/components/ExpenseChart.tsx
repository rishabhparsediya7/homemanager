import React, { useEffect, useState } from "react";
import { getWeek } from "@/utils/getCurrentWeek";
import { Charts } from "./Charts";
export default function ExpenseChart() {
    const [dataList, setDataList] = useState<number[]>([]);
    const weekArray = getWeek();
    const fetchWeekData = async () => {
        let email;
        if (typeof window !== "undefined") {
            const storageUser = String(localStorage.getItem("user"));
            const user = JSON.parse(storageUser);
            email = user.email;
        }
        const response = await fetch('/api/chart', {
            method: 'post',
            body: JSON.stringify({ weekArray, email }),
            headers: {
                'content-type': 'application/json'
            }
        })
        if (response.status === 200) {
            const result = await response.json();
            setDataList(result.weekArray)
        }
        else {
            console.log('not settring the data')
        }
    }

    const data = {
        labels: weekArray,
        datasets: [
            {
                label: 'Expense in Rs.',
                data: dataList,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };
    useEffect(() => {
        fetchWeekData()
    }, []);
    return (
        <Charts dataList={data} />
    );
}