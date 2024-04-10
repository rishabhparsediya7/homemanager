'use client';

import CalendarApp from "@/components/Calendar";
import ExpenseChart from "@/components/ExpenseChart";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const [loggedIn, setLoggedIn] = useState<boolean>();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        setLoggedIn(!!isLoggedIn);
        if (token === null) {
            redirect('/')
        }
    }, [])

    return (
        <div>
            <Navbar />
            {loggedIn && <><div className="w-full flex justify-center py-4">
                <CalendarApp />
            </div>
                <div className="max-w-full">
                    <ExpenseChart />
                </div></>}
        </div>)
}