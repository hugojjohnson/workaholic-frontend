import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ApiUrlContext, UserContext } from "../Context"

import axios from "axios"


export default function Settings({timer}) {

    const possibleDurations = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
    const [duration, setDuration] = useState(30)
    const [user, setUser] = useContext(UserContext)
    const apiUrl = useContext(ApiUrlContext)
    const [projects, setProjects] = useState(user.projects)
    const [uselessVar, setUselessVar] = useState(0) // Just here so I can trigger re-renders safely.
    const navigate = useNavigate()

    const updateUser = async (myMins = null) => {
        let actualMins = duration // Updating the UI and the user doesn't happen the same frame so this is why we have this.
        if (myMins) {
            actualMins = myMins
        }
        console.log("updating user")
        console.log("updating at " + duration + " minutes")
        setUser({ ...user, duration: actualMins, projects: projects })
        // localStorage.setItem("workaholicUser", JSON.stringify({...user, duration: duration, projects: projects}))
        const response = await axios.post(apiUrl + "users/update-user", { token: user.token, projects: projects, duration: actualMins })
        console.log(response)
    }

    
    const projectHTML = (index) => {
        return <div key={index} className="w-64 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md">
            <input className="mr-auto text-lg bg-transparent" value={projects[index]} onBlur={updateUser} onChange={(e) => {
                let test = [...projects]
                test[index] = e.target.value
                setProjects(test)
            }}/>
            <button className="w-7 h-7 text-sm rounded-sm bg-[#424242]" onClick={() => {
                user.projects.splice(index, 1)
                setUselessVar(uselessVar+1)
                updateUser()
            }}>X</button>
            {/* <button className="w-7 h-7 text-sm rounded-sm bg-[#424242]">✔</button> */}
        </div>
    }

    return <div className="px-7 md:px-32 pt-10">
        <h1 className="text-4xl mb-5">Settings</h1>
        <h3 className="text-2xl mb-3">Projects</h3>
        <div className="flex flex-col gap-3">
            {
                projects.map((_, index) => projectHTML(index))
            }
            <button className="w-10 h-10 self-start bg-[#323232] rounded-md" onClick={() => {
                projects.push("")
                setUselessVar(uselessVar + 1)
                updateUser()
            }}>+</button>
        </div>

        <h3 className="text-2xl mb-3 mt-6">Study Timer</h3>
        <select className="w-64 p-2 flex flex-row items-center gap-2 bg-[#323232] rounded-md text-lg" value={user.duration + " minutes"} onChange={(e) => {
            const myMins = parseInt(e.target.value.substring(0, e.target.value.indexOf(" minutes")))
            setDuration(myMins)
            updateUser(myMins)
            timer.resetClock(myMins)
        }}>
            {
                possibleDurations.map((duration, index) => <option key={index}>{duration} minutes</option>)
            }
        </select>

        <button className="text-lg p-3 mt-10 border-[1px] border-white rounded-md" onClick={async () => {
            try {
                const response = await axios.post(apiUrl + "users/sign-out", {
                    token: user.token
                })
                console.log(response)
            } catch (err) {
                console.log(err)
            }
            setUser({})
            navigate("/")

        }}>Sign out</button>
    </div>
}