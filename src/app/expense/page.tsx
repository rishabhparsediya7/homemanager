'use client'
import { Charts } from "@/components/Charts";
import Navbar from "@/components/Navbar";
import isAuth from "@/components/isAuth";
import { getMonthDates, getWeek } from "@/utils/getCurrentWeek";
import { useEffect, useState } from "react";
type DataListProps = {
    label: string,
    data: number[],
    backgroundColor: string,
}
interface Props {
    labels: string[],
    datasets: DataListProps[]
}

const ExpenseChart = () => {
    const [weekData, setWeekData] = useState<Props>({
        labels: [],
        datasets: [{
            label: "",
            data: [],
            backgroundColor: ''
        }]
    });
    const [monthData, setMonthData] = useState<Props>({
        labels: [],
        datasets: [{
            label: "",
            data: [],
            backgroundColor: ''
        }]
    });
    const weekArray = getWeek();
    const monthArray = getMonthDates()
    let email: string;
    try {
        if (typeof window !== undefined) {
            const user = JSON.parse(String(localStorage.getItem('user')));
            email = user.email;
        }
    } catch (error) {

    }

    const getWeekData = async () => {
        try {
            const response = await fetch(`/api/chart`, {
                method: 'POST',
                body: JSON.stringify({ weekArray, email }),
                headers: {
                    'content-type': 'application/json'
                }
            })
            const dataWeek = await response.json();
            setWeekData({
                ...weekData,
                labels: weekArray,
                datasets: [{
                    label: 'Expense This Week',
                    data: dataWeek.weekArray,
                    backgroundColor: '#3b0764'
                }]
            })
        } catch (error) {
            console.log(error);
        }
    }
    const getMonthData = async () => {
        try {
            const response = await fetch(`/api/chart?type=month&email=${email}`)
            if (response.status === 200) {
                const dataMonth = await response.json();
                setMonthData({
                    ...monthData,
                    labels: monthArray,
                    datasets: [{
                        label: 'Expense This Month',
                        data: dataMonth.monthData,
                        backgroundColor: '#252525'
                    }]
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getWeekData()
        getMonthData()
    }, [])
    return (
        <div>
            <Navbar />
            <div className="flex flex-wrap gap-x-2 p-4">
                <div className="flex-1 shadow-md rounded-md"><Charts dataList={weekData} /></div>
                <div className="flex-1 shadow-md"><Charts dataList={monthData} /></div>
            </div>
        </div>
    )
}
export default isAuth(ExpenseChart)