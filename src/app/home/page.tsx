'use client';

import CalendarApp from "@/components/Calendar";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import withAuth from "../_auth/page";
const Home = () => {
    return (
        <div>
            <Navbar />
            <div className="">
                <Image
                    className="h-[15rem] sm:h-[10rem] w-full"
                    src="/bghom.jpg"
                    alt="bghome"
                    width={500}
                    height={500}
                >
                </Image>
            </div>
            <div className="flex absolute top-24 flex-col justify-center sm:items-center w-full p-4">
                <div className="flex flex-col sm:flex-row sm:gap-x-4">
                    <h1 className="text-6xl font-semibold textheading">Home</h1>
                    <h2 className="text-6xl font-semibold textheading">Manager</h2>
                </div>
                <p className="my-2 w-2/3 text-black sm:text-center italic">Now, you can manage, track and visualise your expenses.</p>
            </div>
            <div className="w-full flex justify-center py-4">
                <CalendarApp />
            </div>
        </div>
    )
}

export default withAuth(Home)