'use client'
import { Charts } from "@/components/Charts";
import Navbar from "@/components/Navbar";
import { getMonthDates, getWeek } from "@/utils/getCurrentWeek";
import { Suspense, useEffect, useState } from "react";
import withAuth from "../_auth/page";
import { PieChart } from "@/components/PieChart";
import Image from "next/image";
import Loader from "@/components/Loader";
import { converter } from "@/utils/currencyFormatter";
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
    const [name, setName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [expenseData, setExpenseData] = useState([]);
    const [expenseLabels, setExpenseLabels] = useState([]);
    const weekArray = getWeek();
    const monthArray = getMonthDates()
    let email: string;


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
    const getExpenseData = async () => {
        try {
            const response = await fetch(`/api/chart?type=expenseType&email=${email}`)
            if (response.status === 200) {
                const dataExpense = await response.json();
                setExpenseData(dataExpense.expenseData.map((expense: any) => expense.amount))
                setExpenseLabels(dataExpense.expenseData.map((expense: any) => expense.type))
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        try {
            if (typeof window !== undefined) {
                const user = JSON.parse(String(localStorage.getItem('user')));
                email = user.email;
                setName(user.displayName);
                setPhotoUrl(user.photoURL)

            }
        } catch (error) {

        }
        getWeekData()
        getMonthData()
        getExpenseData()
    }, [])
    return (
        <div>
            <Navbar />
            <Suspense fallback={<Loader />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
                    <div className="shadow-md bg-[#f0fff0] rounded-md flex flex-col p-4">
                       {photoUrl && <div className="flex space-x-2">
                            <div className="h-20 w-20">
                                <Image className="rounded-md" src={photoUrl} alt={name} height={500} width={500} />
                            </div>
                            <div className="flex flex-col h-full">
                                <h1 className="text-xl flex-grow my-auto font-semibold tracking-tight">{name}</h1>
                                <p className="text-sm w-fit space-x-1 flex">
                                    <span>Last Login</span>
                                    <span className="h-2 w-2 m-auto bg-green-500 rounded-full" />
                                </p>
                                <p className="text-xs">Mon Apr 15 2024, 12:15:16 PM</p>
                            </div>
                        </div>}
                        <div className="py-2 flex-grow">
                            <div className="flex space-x-2 items-center">
                                <p className="w-36">Monthly expense</p>
                                <p className="text-sm">
                                    {
                                        converter(monthData.datasets[0].data.reduce((acc, curr) => acc + curr, 0).toString())
                                    }
                                </p>
                            </div>
                            <div className="flex space-x-2 items-center">
                                <p className="w-36">
                                    Weekly expense
                                </p>
                                <p className="text-sm">
                                    {
                                        converter(weekData.datasets[0].data.reduce((acc, curr) => acc + curr, 0).toString())
                                    }
                                </p>
                            </div>
                        </div>
                        <p className="text-sm mb-2">
                            Expenses Variations
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {expenseLabels.map((expense: string, index: number) => (
                                <div key={expense} className="flex text-white p-2 rounded-md justify-center flex-col space-y-1 bg-lime-500 w-20">
                                    <p className="text-center text-sm">{expense}</p>
                                    <p className="text-center text-sm">{converter(expenseData[index])}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="shadow-md rounded-md p-2"><Charts dataList={weekData} /></div>
                    <div className="shadow-md rounded-md p-2"><PieChart expenseData={expenseData} expenseLabels={expenseLabels} /></div>
                    <div className="shadow-md rounded-md p-2"><Charts dataList={monthData} /></div>
                </div>
            </Suspense>
        </div>
    )
}
export default withAuth(ExpenseChart)