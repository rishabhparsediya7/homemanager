import { ExpenseTypeArray } from "@/lib/constants";
import { useEffect, useState } from "react";
import { PieChart } from "./PieChart";

export default function ExpenseTypeChart(
    { email }:
        { email: string }) {
    const [expenseData, setExpenseData] = useState<number[]>([])
    const [expenseLabels, setExpenseLabels] = useState<string[]>([])
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
    useEffect(() => { getExpenseData() }, [])
    return (<div className="shadow-md rounded-md p-2">
        <PieChart expenseData={expenseData} expenseLabels={expenseLabels} />
    </div>)
}