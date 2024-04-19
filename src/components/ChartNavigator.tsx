import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

export default function ChartNavigator({ type, setType }: { type: string, setType: Dispatch<SetStateAction<string>> }) {
    const handleChartType = (event: ChangeEvent<HTMLInputElement>) => {
        setType(event.target.value);
    };
    const chartArray: string[] = ['weekly', 'monthly', 'expense'];
    const [firstChecked, setFirstChecked] = useState(true);

    return (
        <div className='flex items-center space-x-6 w-full py-8'>
            {chartArray.map((chart, index) => (
                <div className="chart-navigator" key={chart}>
                    <input
                        type="radio"
                        name="selecttype"
                        id={chart}
                        onChange={handleChartType}
                        value={chart}
                        defaultChecked={firstChecked && index === 0}
                        onClick={() => setFirstChecked(false)}
                    />
                    <label htmlFor={chart}>{chart}</label>
                </div>
            ))}
        </div>
    );
}
