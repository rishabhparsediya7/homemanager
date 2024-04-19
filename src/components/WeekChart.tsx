import { getWeek } from "@/utils/getCurrentWeek";
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
export default function WeekChart({ email }: { email: string }) {
    const weekArray = getWeek();
    const [weekData, setWeekData] = useState<Props>({
        labels: [],
        datasets: [{
            label: "",
            data: [],
            backgroundColor: [],
            borderRadius: 0
        }]
    });
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
                    backgroundColor: ['#f9aec4', '#c6f2a4', '#333333', "#FFC774", "#b1c5fa"],
                    borderRadius: 20
                }]
            })
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getWeekData()
    }, [])
    return (
        <div className="rounded-md">
            <Charts dataList={weekData} />
        </div>)
}