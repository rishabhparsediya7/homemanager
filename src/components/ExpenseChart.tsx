import React, { useEffect, useState } from "react";
import Chart from "chart.js";
import { months, weekdays } from "@/lib/constants";
import { getWeek } from "@/utils/getCurrentWeek";
export default function ExpenseChart() {
    const [dataList, setDataList] = useState([]);
    const weekArray = getWeek();
    const fetchWeekData = async () => {
        let email;
        if (typeof window !== "undefined") {
            const storageUser = localStorage.getItem("user");
            const user = JSON.parse(storageUser);
            email = user.email;
        }
        const response = await fetch('/api/chart', {
            method: 'post',
            body: JSON.stringify({ weekArray, email }),
            headers: {
                'content-type': 'application/json'
            }
        })
        if (response.status === 200) {
            const result = await response.json();
            setDataList(result.weekArray)
        }
        else {
            console.log('not settring the data')
        }
    }
    const getChart = () => {
        let config = {
            type: "bar",
            data: {
                labels: weekArray,
                datasets: [
                    {
                        label: months[new Date().getMonth()],
                        backgroundColor: "#3949AB",
                        borderColor: "#3949AB",
                        data: dataList,
                        fill: true,
                        color: "#3949AB",
                        barThickness: 10,
                    }
                ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                title: {
                    display: true,
                    text: "Current Week Expense Chart",
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                hover: {
                    mode: "nearest",
                    intersect: true,
                },
                legend: {
                    labels: {
                        fontColor: "rgba(0,0,0,.4)",
                    },
                    align: "end",
                    position: "bottom",
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: "Week",
                            },
                            gridLines: {
                                borderDash: [2],
                                borderDashOffset: [2],
                                color: "rgba(33, 37, 41, 0.3)",
                                zeroLineColor: "rgba(33, 37, 41, 0.3)",
                                zeroLineBorderDash: [2],
                                zeroLineBorderDashOffset: [2],
                            },
                        },
                    ],
                    yAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: "Value",
                            },
                            gridLines: {
                                borderDash: [2],
                                drawBorder: false,
                                borderDashOffset: [2],
                                color: "rgba(33, 37, 41, 0.2)",
                                zeroLineColor: "rgba(33, 37, 41, 0.15)",
                                zeroLineBorderDash: [2],
                                zeroLineBorderDashOffset: [2],
                            },
                        },
                    ],
                },
            },
        };
        let ctx = document.getElementById("bar-chart").getContext("2d");
        window.myBar = new Chart(ctx, config);
    }
    useEffect(() => {
        fetchWeekData()
    }, [])
    useEffect(() => {
        getChart()
    }, [dataList]);
    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                            This Week
                        </h6>
                        <h2 className="text-blueGray-700 text-xl font-semibold">
                            Days Expense
                        </h2>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-16 h-[30rem]  flex-auto">
                <div className="relative bg-slate-100 rounded-md h-full">
                    <canvas id="bar-chart" className="h-full"></canvas>
                </div>
            </div>
        </div>
    );
}