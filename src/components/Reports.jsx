import React, { useContext } from 'react';
import { LogsContext, UserContext } from "./../Context";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';


export default function Reports() {
    const [user, setUser] = useContext(UserContext)
    const [logs, setLogs] = useContext(LogsContext)

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors);
    ChartJS.register(annotationPlugin);

    ChartJS.defaults.color = '#DDD';

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                label: {
                    color: 'rgba(255, 255, 255, 0.5)', // Change this to your desired text color
                }
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
                color: 'rgba(255, 255, 255, 0.5)', // Change this to your desired text color
            },
            annotation: {
                annotations: {
                    box1: {
                        // Indicates the type of annotation
                        type: "line",
                        yMin: 3,
                        yMax: 3,
                        borderColor: 'rgba(185, 50, 50, 1)',
                        borderDash: [10],
                        borderWidth: 1
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
        datasets: {
            bar: {
                borderRadius: 5
            }
        }
    };

    // Set up the relevant date window
    var monday = new Date(Date.now());
    while (monday.getDay() !== 1) {
        monday = new Date(monday - 86400000)
    }
    var labels = []
    for (let i = 0; i < 7; i++) {
        labels.push(new Date(monday))
        monday.setDate(monday.getDate() + 1);
    }

    const isSameDay = (a, b) => {
        if (a === undefined || b === undefined) {
            console.error("a or b is undefined")
            return false
        }
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
    }

    // Construct datasets
    let my_datasets = []
    for (const project of user.projects) {
        // filter the relevant project
        let projectLogs = logs.filter(idk => idk.project === project)

        // for each day, find the same day values
        let my_data = []
        for (const myDay of labels) {
            const sameDayLogs = projectLogs.filter(idk => isSameDay(idk.timeStarted, myDay))
            let x = 0
            for (const sameDayLog of sameDayLogs) {
                x += sameDayLog.duration
            }
            my_data.push(x/60)
        }
        my_datasets.push({
            label: project,
            data: my_data,
            // backgroundColor: 'rgba(255, 99, 132, 0.5)',
        })
    }

    const data = {
        labels: labels.map(idk => idk.toLocaleString().split(",")[0].slice(0, -5)),
        datasets: my_datasets
        // datasets: [
        //     {
        //         label: 'MATH2069',
        //         data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6],
        //         // backgroundColor: 'rgba(255, 99, 132, 0.5)',
        //     },
        //     {
        //         label: 'ISYS2110',
        //         data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6],
        //         // backgroundColor: 'rgba(53, 162, 235, 0.5)',
        //     },
        // ],
    };

    let totalMinutes = 0
    let totalIntervals = 0
    for (const log of logs) {
        totalMinutes += log.duration
        totalIntervals += 1
    }

    function getStreak() {
        if (logs.length === 0) {
            return 0
        }
        // Get streak, starting from today, but today isn't really necessary.
        const sortedDateList = logs.map(idk => new Date(idk.timeStarted).getTime()).sort().reverse()
        const today = new Date();
        // yesterday.setDate(yesterday.getDate() - 1);
        today.setHours(0, 0, 0, 0);
        var streak = 0
        // Handle today: special case
        const coolThingLol = new Date(sortedDateList[0])
        coolThingLol.setHours(0, 0, 0, 0)
        if (today.getTime() === coolThingLol.getTime()) {
            streak += 1
        }
        today.setDate(today.getDate() - 1);
        for (let i = 0; i < sortedDateList.length; i++) {
            const currentDate = new Date(sortedDateList[i]);
            currentDate.setHours(0, 0, 0, 0);
            if (currentDate.getTime() === today.getTime()) {
                streak++;
                today.setDate(today.getDate() - 1);
            }
        }
        return streak
    }

    const streak = getStreak()


    const daysPassed = Math.ceil((new Date().getTime() - new Date("2024-02-19").getTime())/(24 * 60 * 60 * 1_000))

    const stats = [
        ["Total hours", Math.round(totalMinutes/60 * 10)/10, 0],
        ["Total intervals", totalIntervals, 1],
        ["Streak", streak, 1],
        ["Average daily hours", Math.round(totalMinutes/(60*daysPassed)*10)/10, 0]
    ]

    const statsHTML = (info) => {
        return <div key={info[0]} className={`flex flex-col gap-1 items-center ${info[2] === 0 ? "hidden md:block md:opacity-100" : ""}`}>
            <h3 className='text-lg'>{info[0]}</h3>
            <p className='text-2xl text-[#4da88d]'>{info[1]}</p>
        </div>
    }

    return <div className='px-7 md:px-32 pt-10'>
        <h1 className="text-4xl mb-5">Reports</h1>
        <div className='flex flex-row justify-around text-center'>
            {
                stats.map(idk => statsHTML(idk))
            }
        </div>
        <div className='mx-auto m-0 md:m-10 md:mx-auto mt-32 max-w-screen-lg'>
            <Bar options={options} data={data} />
        </div>
    </div>
}