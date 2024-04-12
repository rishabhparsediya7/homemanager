'use client';

import CalendarApp from "@/components/Calendar";
import ExpenseChart from "@/components/ExpenseChart";
import Navbar from "@/components/Navbar";
import Image from "next/image";
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
            <div className="">
                <Image
                    className="h-[12rem]"
                    src="/bghome.jpg"
                    alt="bghome"
                    width={500}
                    height={500}
                >
                </Image>
            </div>
            <div className="flex flex-col justify-center sm:items-center w-full p-4">
                <div className="flex flex-col sm:flex-row sm:gap-x-4">
                    <h1 className="text-6xl font-semibold textheading">Home</h1>
                    <h2 className="text-6xl font-semibold textheading">Manager</h2>
                </div>
                <p className="my-2 text-black italic">Now, you can manage, track and visualise your expenses.</p>
            </div>
            <div className="w-full flex justify-center py-4">
                <CalendarApp />
            </div>
            <div className="max-w-full">
                <ExpenseChart />
            </div>
        </div>
    )
}