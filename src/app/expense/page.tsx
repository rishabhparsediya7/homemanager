'use client'
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

export default function Expense() {

    const [loggedIn, setLoggedIn] = useState<boolean>();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        setLoggedIn(!!isLoggedIn);
        if (token === null) {
            redirect('/')
        }
    }, [])
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<string>("");

    const toggleModal = () => {
        console.log('modal open')
        const body = document.querySelector(".bodyy");
        body.classList.toggle("open-modal");
    }
    const handleAddExpense = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const response = await fetch('/api/expense', {
                method: "POST",
                body: JSON.stringify({ name, amount }),
                headers: {
                    'content-type': 'application/json'
                }
            })
            const data = await response.json();
            console.log(data);

        } catch (error) {

        }
    }
    return (
        <div className="bodyy">
            {loggedIn && <><Navbar />
                <div className="modal-container" onClick={toggleModal}></div>
                <div className="modal-window">
                    <div className="card-container">
                        <form onSubmit={handleAddExpense} className="flex flex-col w-full gap-y-4">
                            <div className="flex">
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Expense name" className="border-b-2 outline-none border-b-gray-300 p-1.5 w-full" />
                            </div>
                            <div>
                                <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="border-b-2 outline-none border-b-gray-300 p-2 w-full" type="text" />
                            </div>
                            <div className="flex flex-col">
                                <button type="submit" className="bg-blue-600 flex justify-center gap-x-2 items-center p-3 rounded-3xl text-white w-full">Add Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="p-4 flex flex-col justify-center">
                    <div className="h-[75vh] flex flex-col overflow-y-scroll">
                        <table className="table-auto bg-white border w-full">
                            <thead className="bg-white p-0">
                                <tr className="text-left">
                                    <th className="p-2">Expense Name</th>
                                    <th className="p-2">Expense Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 30 }).map((a, index: number) => (
                                    <tr key={index} className="border">
                                        <td className="p-2">The Sliding Mr. Bones</td>
                                        <td className="p-2">Malcolm Lockyer</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-full p-2">
                        <h1 className="text-right text-lg tracking-wider text-black">Total: 4200</h1>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col">
                            <button onClick={toggleModal} className="bg-blue-600 flex justify-center gap-x-2 items-center p-3 rounded-3xl text-white w-full">Add Expense</button>
                        </div>
                    </div>
                </div></>}
        </div>
    )
}