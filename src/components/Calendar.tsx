'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { months, weekdays, supArray } from '@/lib/constants';
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarApp() {
    const [value, onChange] = useState<Value>(new Date());
    const [date, setDate] = useState<string>('');
    const [dateQuery, setDateQuery] = useState('');
    useEffect(() => {
        const q = value?.toLocaleString();
        const query = new Date(String(q));
        setDateQuery(String(query.getDate().toString().padStart(2, '0') + "-" + (query.getMonth() + 1).toString().padStart(2, '0') + "-" + query.getFullYear().toString()));
        const d = value?.toLocaleString().split(',')[0].split('/');
        if (d !== undefined) {
            const num: number = Math.floor(parseInt(d[1]) % 10);
            let sup = '';
            switch (num) {
                case 1:
                    sup = supArray[num - 1];
                    break;
                case 2:
                    sup = supArray[num - 1];
                    break;
                case 3:
                    sup = supArray[num - 1];
                    break;
                default:
                    sup = supArray[3];
            }
            const dat = new Date(parseInt(d[2]), parseInt(d[0]) - 1, parseInt(d[1]));
            const dt: string = (weekdays[dat.getDay()] + ", " + d[1] + sup + " " + months[parseInt(d[0]) - 1] + ", " + d[2]).toString();
            setDate(dt);
        }
    }, [value])

    return (
        <div className='flex flex-col'>
            <Calendar onChange={onChange} value={value} />
            <div className='w-full text-center flex justify-between items-center py-2 gap-y-2'>
                <p className='border-b border-gray-500 text-black'>{date}</p>
                <Link href={`/expense/${dateQuery}`} className='bg-black px-4 py-2 text-white w-fit rounded-md'>
                    Get Expenses
                </Link>
            </div>
        </div>
    );
}

