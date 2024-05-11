import { useContext, useState } from "react"
import { UserContext } from "../Context"


export default function Settings({timer}) {

    const possibleDurations = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
    const [duration, setDuration] = useState(30)
    const [user, setUser] = useContext(UserContext)

    
    const projectHTML = (project, index) => {
        return <div key={index} className="w-64 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md">
            <p className="mr-auto text-lg">{project}</p>
            <button className="w-7 h-7 text-sm rounded-sm bg-[#424242]">X</button>
            <button className="w-7 h-7 text-sm rounded-sm bg-[#424242]">✔</button>
        </div>
    }

    return <div className="px-7 md:px-32 pt-10">
        <h1 className="text-4xl mb-5">Settings</h1>
        <h3 className="text-2xl mb-3">Projects</h3>
        <div className="flex flex-col gap-3">
            {
                user.projects.map((project, index) => projectHTML(project, index))
            }
        </div>

        <h3 className="text-2xl mb-3 mt-6">Study Timer</h3>
        <select className="w-64 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={user.duration + " minutes"} onChange={(e) => {
            const myMins = parseInt(e.target.value.substring(0, e.target.value.indexOf(" minutes")))
            setUser({ ...user, duration: myMins })
            timer.resetClock(myMins)
        }}>
            {
                possibleDurations.map((duration, index) => <option key={index}>{duration} minutes</option>)
            }
        </select>
    </div>
}