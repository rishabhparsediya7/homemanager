'use client'
import { Charts } from "@/components/Charts";
import Navbar from "@/components/Navbar";
import { getDatesInCurrentMonthWithTimes, getMonthDates, getWeek } from "@/utils/getCurrentWeek";
import { Suspense, useEffect, useState } from "react";
import withAuth from "../_auth/page";
import { PieChart } from "@/components/PieChart";
import Image from "next/image";
import Loader from "@/components/Loader";
import { converter } from "@/utils/currencyFormatter";
import { ExpenseTypeArray } from "@/lib/constants";
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
    const [lastLogin, setLastLogin] = useState(0);
    const [expenseData, setExpenseData] = useState<number[]>([]);
    const [expenseLabels, setExpenseLabels] = useState<string[]>([]);
    const weekArray = getWeek();
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
                const { result } = await response.json();
                const monthArray = getDatesInCurrentMonthWithTimes();
                const groupArray = result.reduce((group: any, expense: any) => {
                    const { date } = expense;
                    group[date] = group[date] ?? [];
                    group[date].push(expense);
                    return group;
                }, {});
                const dataList = Object.keys(groupArray).sort();
                const monthData: number[] = [];
                for (var i = 0; i < monthArray.length; i++) {
                    if (dataList.includes(monthArray[i])) {
                        const value = groupArray[monthArray[i]];
                        const sum = value.reduce((acc: any, curr: any) => curr.amount + acc, 0);
                        monthData.push(sum);
                    } else monthData.push(0);
                }
                setMonthData({
                    ...monthData,
                    labels: getMonthDates(),
                    datasets: [{
                        label: 'Expense This Month',
                        data: monthData,
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
                const { result } = await response.json();
                const groupArray = result.reduce((group: any, expense: any) => {
                    const { expenseType } = expense;
                    group[expenseType] = group[expenseType] ?? [];
                    group[expenseType].push(expense);
                    return group;
                }, {});
                const expTypeArray = ExpenseTypeArray;
                const ExpenseData = [];
                for (var i = 0; i < expTypeArray.length; i++) {
                    if (groupArray[expTypeArray[i]]) {
                        const value = groupArray[expTypeArray[i]];
                        const sum = value.reduce((acc: any, curr: any) => curr.amount + acc, 0);
                        const newItem = {
                            type: expTypeArray[i],
                            amount: sum,
                        };
                        ExpenseData.push(newItem);
                    }
                }
                setExpenseData(ExpenseData.map((expense: any) => expense.amount))
                setExpenseLabels(ExpenseData.map((expense) => expense.type))
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
                setLastLogin(parseInt(user.lastLoginAt))
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
                    <div className="shadow-md text-white bg-gradient-to-br from-black to-transparent rounded-md flex flex-col p-4">
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
                                <p className="text-xs">{new Date(lastLogin).toDateString()},{new Date(lastLogin).toLocaleTimeString()}</p>
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
                                <div key={index} className="flex text-white px-2 py-1 rounded-md justify-center flex-col space-y-1 bg-[#000000B7] w-fit">
                                    <p className="text-center text-[12px]">{expense}</p>
                                    <p className="text-center tracking-wider text-[10px]">{converter(expenseData[index].toString())}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="shadow-md rounded-md p-2"><Charts dataList={monthData} /></div>
                    <div className="shadow-md rounded-md p-2"><Charts dataList={weekData} /></div>
                    <div className="shadow-md rounded-md p-2"><PieChart expenseData={expenseData} expenseLabels={expenseLabels} /></div>
                </div>
            </Suspense>
        </div>
    )
}
export default withAuth(ExpenseChart)