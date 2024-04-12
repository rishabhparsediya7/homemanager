'use client'
import Charts from "@/components/Charts";
import Navbar from "@/components/Navbar";

export default function ExpenseChart() {
    return (
        <div>
            <Navbar />
            <Charts data={[15, 20, 30, 15]} bgColor={'bg-indigo-100'} id={"weekchart"} labelArray={['Groceries', "Food", "Travel", "Other"]} label={"Various Expenses"} titleText={"Expense Type Chart"} />
            <Charts data={[30, 28, 31, 15]} id={"monthchart"} bgColor={"bg-gray-100"} labelArray={['Groceries', "Food", "Travel", "Other"]} label={"According to Month"} titleText={"Expense Type Chart"} />
        </div>
    )
}