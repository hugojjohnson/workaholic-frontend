import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiUrlContext, LogsContext, UserContext } from "./../../Context"

export default function Dashboard({ timer }) {
    const apiUrl = useContext(ApiUrlContext)
    const [user, setUser] = useContext(UserContext)

    return <>
        <div className="w-full h-20 text-xl text-gray-300 flex flex-row justify-center md:justify-end items-center gap-5 md:pr-10">
            <Link className="text-white border-[0.5px] border-white rounded-md p-2" to="/sign-in">Sign in</Link>
            <Link className="text-white border-[0.5px] border-white rounded-md p-2" to="/sign-up">Sign up</Link>
            {/* <Link to="/profile" style={{ "display": "flex", "alignItems": "center" }}>
                <img className="profile-pic" src={profileUrl} alt="profile pic" />
                <p>Profile</p>
            </Link> */}
        </div>

    <div className="flex flex-col gap-8 items-center max-w-screen-sm mx-auto">
    
        {/* <div className="flex flex-row gap-3 justify-center">
            <p className="text-8xl">{timer.minutes}:{timer.seconds > 9 ? timer.seconds : ("0" + timer.seconds)}</p>
        </div> */}
        {/* <div className="w-full max-w-screen-sm px-5">
            <p className="text-sm text-gray-400">I made progress on</p>
            <input className="w-full px-3 py-1 text-lg border-[1px] border-white bg-transparent rounded-md" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div> */}

        { /* <button className="w-30 w-28 px-4 py-2 text-lg border-[1px] border-green-300 text-green-300 rounded-md" onClick={() => sendLog()}>Finish</button> */}
        {/* <button className={`w-30 w-28 px-4 py-2 text-lg border-[1px] ${!timer.paused ? "border-gray-500 text-gray-500" : "border-white"} rounded-md`} onClick={() => timer.pressPause()}>{timer.paused ? "Start" : "Pause"}</button> */}


        {/* <div>
            <h1>Hours studied today</h1>
            <p className="self-center text-center text-2xl text-red-300">{Math.floor(minutesStudiedToday / 60)}h {minutesStudiedToday % 60}min</p>
        </div>
        <img className={`fixed ${confetti ? "h-full w-full top-0" : "h-0 w-0"} transition-all duration-50`} src={"/confetti.gif"} alt="confetti" /> */}
    </div></>
}
