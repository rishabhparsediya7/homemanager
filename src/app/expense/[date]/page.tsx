'use client'
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { converter } from "@/utils/currencyFormatter";
import isAuth from "@/components/isAuth";

type ExpenseType = {
    name: string;
    amount: string;
    expenseType: string;
    date: string;
}

const Expense = () => {
    const params = useParams();
    const { date } = params;
    const [error, setError] = useState<string>('');
    const [name, setName] = useState<string>("");
    const [dependencyCount, setDependencyCount] = useState<number>(0);
    const [amount, setAmount] = useState<string>("");
    const [expenseType, setExpenseType] = useState('');
    const [loggedIn, setLoggedIn] = useState<boolean>();
    const [loading, setLoading] = useState<boolean>(false);
    const [expenseList, setExpenseList] = useState([]);
    const expenseTypeArray: string[] = ['Grocery', "Travel", "Food", "Bills", "Other"];
    function getSum() {
        const sum: number = expenseList.reduce((total, curr: ExpenseType) => parseFloat(curr.amount) + total, 0)
        return sum.toString();
    }
    const toggleModal = () => {
        const body = document.querySelector(".bodyy");
        if (body !== null) {
            body.classList.toggle("open-modal");
        }
    }
    const handleAddExpense = async (event: React.FormEvent) => {
        event.preventDefault()
        if (isNaN(parseFloat(amount))) {
            setError('Amount should be in number..')
            return;
        }
        setLoading(true);
        const amnt: number = parseInt(amount);
        try {
            let email;
            if (typeof window !== "undefined") {
                const storageUser = String(localStorage.getItem("user"));
                const user = JSON.parse(storageUser);
                email = user.email;
            }
            const response = await fetch('/api/expense', {
                method: "POST",
                body: JSON.stringify({ date: date, name: name, amount: amnt, expenseType: expenseType, email: email }),
                headers: {
                    'content-type': 'application/json'
                }
            })
            if (response.status === 200) {
                const data = await response.json();
                setDependencyCount((prev) => prev + 1)
                toggleModal()
            }
            else {
                setError('Could not add the expense')
            }
        } catch (error) {
            console.log(error);
            setError(JSON.stringify(error));
        }
        finally {
            setLoading(false);
            setName('');
            setAmount('');
        }
    }
    const handleExpenseTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setExpenseType(event.target.value);
    };

    const fetchAllTheExpenses = useCallback(async () => {
        setLoading(true);
        try {
            let email, guid;
            if (typeof window !== "undefined") {
                const storageUser = String(localStorage.getItem("user"));
                const user = JSON.parse(storageUser);
                email = user.email;
                guid = user.uid;
            }
            const response = await fetch(`/api/expense?email=${email}&guid=${guid}&date=${date}`);
            if (response.status === 400) {
                setError('Empty Expenses')
            }
            else {
                const result = await response.json();
                if (result.expense !== undefined)
                    setExpenseList(result.expense);
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
            setError('')
        }
    }, [])

    useEffect(() => {
        fetchAllTheExpenses();
    }, [dependencyCount, fetchAllTheExpenses])
    if (dependencyCount === 0 && loading)
        return <Loader />
    return (
        <div className="bodyy">
            <Navbar />
            <div className="modal-container" onClick={toggleModal}></div>
            <div className="modal-window">
                <div className="card-container">
                    {error && <p className="text-red-400">{error}</p>}
                    <form className="flex flex-col w-full gap-y-4">
                        <div className="flex">
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Expense name" className="border-b-2 outline-none border-b-gray-300 p-1.5 w-full" />
                        </div>
                        <div>
                            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="border-b-2 outline-none border-b-gray-300 p-2 w-full" type="text" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {
                                expenseTypeArray.map((expense: string) => (
                                    <div key={expense} className="space-x-2">
                                        <input
                                            className="checkbox-tools"
                                            type="radio"
                                            name="expenseType"
                                            id={expense}
                                            value={expense}
                                            checked={expenseType === expense}
                                            onChange={handleExpenseTypeChange}
                                        />
                                        <label htmlFor={expense}>{expense}</label>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex flex-col">
                            <button onClick={(e) => handleAddExpense(e)} className="bg-blue-600 flex justify-center gap-x-2 items-center p-3 rounded-3xl text-white w-full">Add Expense</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="p-4 flex flex-col justify-center items-center">
                {expenseList.length <= 0 &&
                    <div className="w-full">
                        <Image
                            src="/emptyexpense.png"
                            alt="empty expense"
                            height={500}
                            width={500}
                        ></Image>
                    </div>
                }
                <div className={` ${expenseList.length > 0 ? `h-[75vh]` : `h-fit`} flex flex-col overflow-y-scroll`}>
                    {expenseList.length > 0 && <table className="max-w-[50rem] table-auto bg-white border w-full">
                        <thead className="bg-white p-0">
                            <tr className="text-left">
                                <th className="p-2">Expense Name</th>
                                <th className="p-2">Expense Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseList.length > 0 && expenseList.map((a: ExpenseType, index: number) => (
                                <tr key={index} className="border">
                                    <td className="p-2 first-letter:capitalize">{a.name}</td>
                                    <td className="p-2 text-green-500">{converter(a.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                    {loading && <Loader />}
                </div>
                <div className="w-full p-2 max-w-md">
                    <h1 className="text-right text-green-500 text-lg tracking-wider">
                        Total: <span className="font-bold"> {converter(getSum())}</span>
                    </h1>
                </div>
                <div className="w-full max-w-md">
                    <div className="flex flex-col">
                        <button onClick={toggleModal} className="bg-blue-600 flex justify-center gap-x-2 items-center p-3 rounded-3xl text-white w-full">Add Expense</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default isAuth(Expense)