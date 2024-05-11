import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiUrlContext, UserContext } from "./../../Context"
import axios from "axios";

export default function SignIn() {
    const apiUrl = useContext(ApiUrlContext)
    const [user, setUser] = useContext(UserContext)

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorText, setErrorText] = useState("")

    const  navigate = useNavigate()

    async function signUp() {
        if (email === "" || password === "" || username === "") {
            setErrorText("Please fill in email, password and username.");
            return;
        }
        if (!email.includes("@")) {
            setErrorText("Email is invalid.")
            return;
        }

        try {
            const salt = await saltify(email + password)
            const response = await axios.post(apiUrl + "users/sign-up/email", {
                username: username,
                email: email,
                hash: salt
            })
            if (response.status !== 200) {
                setErrorText(response.data)
                return;
            }
            navigate('/sign-in');
            return;
        } catch (err) {
            setErrorText(err.message)
        }
    }

    // encrypt the password before sending it
    // from https://stackoverflow.com/questions/18338890
    async function saltify(message) {
        // encode as UTF-8
        const msgBuffer = new TextEncoder().encode(message);

        // hash the message
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // convert bytes to hex string
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        return hashHex;
    }

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
            <div className="w-full">
                <p>Username</p>
                <input className="bg-transparent p-3 rounded-md border-[1px] border-white w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="w-full">
                <p>Email</p>
                <input className="bg-transparent p-3 rounded-md border-[1px] border-white w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="w-full">
                <p>Password</p>
                <input className="bg-transparent p-3 rounded-md border-[1px] border-white w-full" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button className="bg-transparent p-3 border-[1px] border-white rounded-md" onClick={signUp}>Sign In</button>

            <p>{errorText}</p>

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
