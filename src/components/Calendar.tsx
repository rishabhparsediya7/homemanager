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
    // console.log(value, date, dateQuery)

    useEffect(() => {
        const d = String(value);
        const dateString = new Date(d);
        setDate(dateString.toDateString())
        const year = dateString.getFullYear();
        const month = (dateString.getMonth() + 1).toString().padStart(2, '0');
        const date = (dateString.getDate()).toString().padStart(2, '0');
        setDateQuery(`${date}-${month}-${year}`)
    }, [value, dateQuery])

    return (
        <div className='flex flex-col justify-center items-center'>
            <Calendar className="w-full" onChange={onChange} value={value} />
            <div className='w-full text-center flex flex-col py-2 gap-y-3'>
                <p className='border-b w-fit mt-2 border-gray-500 text-black text-left'>{date}</p>
                {dateQuery && <Link href={`/expense/${dateQuery}`} className='bg-black uppercase tracking-wider w-full px-4 py-2 text-white rounded-3xl'>
                    Get Expenses on {dateQuery}
                </Link>}
                <Link href='/dashboard' className='bg-black uppercase tracking-wider w-full px-4 py-2 text-white rounded-3xl'>
                    Acitivities
                </Link>
            </div>
        </div>
    );
}

