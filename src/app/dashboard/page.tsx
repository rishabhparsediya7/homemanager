'use client'
import Navbar from "@/components/Navbar";
import { Suspense, useEffect, useState } from "react";
import withAuth from "../_auth/page";
import Image from "next/image";
import Loader from "@/components/Loader";
import ChartNavigator from "@/components/ChartNavigator";
import WeekChart from "@/components/WeekChart";
import MonthChart from "@/components/MonthChart";
import ExpenseTypeChart from "@/components/ExpenseTypeChart";
import { ExpenseTypeArray } from "@/lib/constants";
import { date } from "zod";
import { CarTaxiFront, Globe, LeafyGreen, ReceiptIndianRupee, UtensilsCrossed } from "lucide-react";
import { converter } from "@/utils/currencyFormatter";

type PieProps = {
    amount: string,
    type: string
}

const NewExpense = () => {
    const [type, setType] = useState('weekly');
    const backGroundColorArray = ['#f9aec4', '#c6f2a4', '#333333', "#FFC774", "#b1c5fa"]
    const IconsArray = [<LeafyGreen key={'Grocery'} size={40} color={'white'} />, <UtensilsCrossed key='Food' size={40} color={'white'} />, <CarTaxiFront key='Travel' size={40} color={'white'} />, <Globe key='Other' size={40} color={'white'} />, <ReceiptIndianRupee key='Bills' size={40} color={'white'} />,]
    const [name, setName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [lastLogin, setLastLogin] = useState(0);
    const [email, setEmail] = useState('');
    const [pieData, setPieData] = useState<PieProps[]>([]);
    const chartArray: string[] = ['weekly', 'monthly', 'expense'];
    const ActiveComponent = () => ComponentsArray[chartArray.indexOf(type)]
    const getExpenseData = async (email: string) => {
        console.log('expense dataa');
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
                const ExpenseData: PieProps[] = [];
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
                setPieData(ExpenseData)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        try {
            if (typeof window !== undefined) {
                const user = JSON.parse(String(localStorage.getItem('user')));
                const email = user.email;
                setEmail(email)
                setLastLogin(parseInt(user.lastLoginAt))
                setName(user.displayName);
                setPhotoUrl(user.photoURL)
                getExpenseData(email)
            }
        } catch (error) {

        }
    }, [])
    const ComponentsArray = [<WeekChart key={'week'} email={email} />, <MonthChart key={'month'} email={email} />, <ExpenseTypeChart email={email} key={'expense'} />]
    return (
        <div>
            <Navbar />
            <Suspense fallback={<Loader />}>
                <div className="p-4">
                    <div className="rounded-md flex flex-col">
                        {photoUrl && <div className="flex space-x-2">
                            <div className="h-20 w-20">
                                <Image className="rounded-md" src={photoUrl} alt={name} height={500} width={500} />
                            </div>
                            <div className="flex flex-col h-full">
                                <h1 className="text-xl leading-[2.6rem] flex-grow my-auto font-semibold tracking-tight">{name}</h1>
                                <p className="text-sm w-fit space-x-1 flex">
                                    <span>Last Login</span>
                                    <span className="h-2 w-2 m-auto bg-green-500 rounded-full" />
                                </p>
                                <p className="text-xs">{new Date(lastLogin).toDateString()},{new Date(lastLogin).toLocaleTimeString()}</p>
                            </div>
                        </div>}
                    </div>
                    <ChartNavigator type={type} setType={setType} />
                    <ActiveComponent />
                    <div className="flex flex-col py-5">
                        <h1 className="text-2xl p-2">Activity</h1>
                        <div className="flex flex-col space-y-2">
                            {
                                pieData.map((data, index) => (
                                    <div
                                        className="w-full p-2 flex items-center rounded-xl" key={data.type}>
                                        <div className="flex w-full">
                                            <div className="p-2 rounded-xl" style={{ backgroundColor: backGroundColorArray[index % backGroundColorArray.length] }}>
                                                {IconsArray.find((type) => type.key === data.type)}
                                            </div>
                                            <div className="w-full p-2 flex justify-between">
                                                <h1 className="text-xl">{data.type}</h1>
                                                <h1>
                                                    {converter(data.amount)}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                pieData.length !== undefined && pieData.length == 0 && <div className="text-center p-2">No Activities Yet.</div>
                            }
                        </div>
                    </div>
                </div>
            </Suspense>
        </div>
    )
}
export default withAuth(NewExpense)