import { getDatesInCurrentMonthWithTimes, getMonthDates } from "@/utils/getCurrentWeek";
import { useEffect, useState } from "react";
import { Charts } from "./Charts";

type DataListProps = {
    label: string,
    data: number[],
    backgroundColor: string[],
    borderRadius: number
}
interface Props {
    labels: string[],
    datasets: DataListProps[]
}

export default function MonthChart({ email }: { email: string }) {
    const [monthData, setMonthData] = useState<Props>({
        labels: [],
        datasets: [{
            label: "",
            data: [],
            borderRadius: 0,
            backgroundColor: []
        }]
    });
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
                        borderRadius: 20,
                        backgroundColor: ['#f9aec4', '#c6f2a4', '#333333', "#FFC774", "#b1c5fa"],
                    }]
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getMonthData()
    }, [])
    return (
        <div className="rounded-md p-2">
            <Charts dataList={monthData} />
        </div>)
}