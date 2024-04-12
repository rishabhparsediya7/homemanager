import { months } from "@/lib/constants";
import Chart from "chart.js";
import { useEffect } from "react";
interface Window {
    myBar?: Chart; // Define myBar as an optional property of type Chart
}

export default function Charts({ id, data, bgColor, labelArray, label, titleText }: { id: string, data: number[], labelArray: string[], label: string, titleText: string, bgColor: string }) {
    const getChart = () => {
        let config = {
            type: "bar",
            data: {
                labels: labelArray,
                datasets: [
                    {
                        label: months[new Date().getMonth()],
                        backgroundColor: "#3949AB",
                        borderColor: "#3949AB",
                        data: data,
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
                    text: titleText,
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
        let canvas = document.getElementById(id) as HTMLCanvasElement | null;
        if (canvas !== null) {
            let ctx = canvas.getContext("2d");
            if (ctx !== null) {
                window['myBar'] = new Chart(ctx, config);
            } else {
                console.error("2D context is null");
            }
        } else {
            console.error("Canvas element not found");
        }
    }
    useEffect(() => {
        getChart();
    }, []);
    return (<div>
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
            <div className="flex flex-wrap items-center">
                <div className="relative w-full max-w-full flex-grow flex-1">
                    <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                        This Week
                    </h6>
                    <h2 className="text-blueGray-700 text-xl font-semibold">
                        {label}
                    </h2>
                </div>
            </div>
        </div>
        <div className="p-4 sm:p-16 h-[30rem]  flex-auto">
            <div className={`relative ${bgColor} rounded-md h-full`}>
                <canvas id={id} className="h-full"></canvas>
            </div>
        </div>
    </div>
    )
}