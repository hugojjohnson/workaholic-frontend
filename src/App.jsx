import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import.meta.env

import { ApiUrlContext, LogsContext, UserContext } from "./Context";
import useTimerBetter from "./hooks/useTimerBetter";

// Components
import Header from "./components/Header";
import Dashboard from './components/Dashboard';
import Settings from "./components/Settings";
import Reports from "./components/Reports";
import NoPage from "./components/NoPage";
import Hero from "./components/signed_out/Hero";
import SignIn from "./components/signed_out/SignIn";
import SignUp from "./components/signed_out/SignUp";

import axios from "axios";

function App() {
  // const apiUrl = "http://localhost:3001/"
  // const apiUrl = "https://workaholic-personal-backend-9c967b6afb64.herokuapp.com/"
  const apiUrl = "https://44.220.164.141.nip.io/"
  const [user, setUser] = useState(undefined)
  const [logs, setLogs] = useState([])
  let timer = useTimerBetter(0)

  useEffect(() => {
    const getData = async (myToken) => {
      try {
        let response = await axios.post(apiUrl + "get-logs", { token: myToken })
        response.data = response.data.map(idk => {
          idk.timeStarted = new Date(idk.timeStarted)
          idk.timeFinished = new Date(idk.timeFinished)
          return idk
        })
        console.log(response.data)
        setLogs(response.data)
      } catch (err) {
        console.error(err)
      }
    }

    if (localStorage.getItem("workaholicUser")) {
      const myTemp = JSON.parse(localStorage.getItem("workaholicUser"))
      timer.resetClock(myTemp.duration)
      setUser(myTemp)
      if (myTemp.token) {
        getData(myTemp.token)
      }
      return
    }
    // You have to change 30 in two places!
    timer.resetClock(30)
    setUser({
      projects: ["Default"],
      activeProject: "Default",
      duration: 0
    })
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("workaholicUser", JSON.stringify(user))
    }
  }, [user])

  if (!user || !user.token) {
    return (
      <ApiUrlContext.Provider value={apiUrl}>
        <UserContext.Provider value={[user, setUser]}>
            <BrowserRouter>
              <Routes>
                <Route path="/">
                  <Route index element={<Hero />} />
                  <Route path="sign-up" element={<SignUp />} />
                  <Route path="sign-in" element={<SignIn />} />
                  <Route path="*" element={<Hero />} />
                </Route>
              </Routes>
            </BrowserRouter>
        </UserContext.Provider>
      </ApiUrlContext.Provider>
    );
  }

  return (
    <ApiUrlContext.Provider value={apiUrl}>
      <UserContext.Provider value={[user, setUser]}>
        <LogsContext.Provider value={[logs, setLogs]}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Header />}>
                <Route index element={<Dashboard timer={timer} />} />
                <Route path="settings" element={<Settings timer={timer} />} />
                <Route path="reports" element={<Reports />} />
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LogsContext.Provider>
      </UserContext.Provider>
    </ApiUrlContext.Provider>
  );
}

export default App;