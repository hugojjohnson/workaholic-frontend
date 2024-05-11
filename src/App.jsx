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
import axios from "axios";

function App() {
  // const apiUrl = "http://localhost:3001/"
  const apiUrl = "https://workaholic-personal-backend-9c967b6afb64.herokuapp.com/"
  const [user, setUser] = useState(undefined)
  const [logs, setLogs] = useState([])
  let timer = useTimerBetter(0)

  useEffect(() => {
    if (localStorage.getItem("workaholicUser")) {
      const myTemp = JSON.parse(localStorage.getItem("workaholicUser"))
      timer.resetClock(myTemp.duration)
      setUser(myTemp)
      return
    }
    // You have to change 30 in two places!
    timer.resetClock(30)
    setUser({
      projects: ["COMP2123", "ISYS2110", "MATH2069"],
      activeProject: "COMP2123",
      duration: 30
    })
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("workaholicUser", JSON.stringify(user))
    }
  }, [user])

  // Manage logs
  useEffect(() => {
    const getData = async () => {
      let response = await axios.post(apiUrl + "get-logs", {})
      response.data = response.data.map(idk => {
        idk.timeStarted = new Date(idk.timeStarted)
        idk.timeFinished = new Date(idk.timeFinished)
        return idk
      })
      setLogs(response.data)
    }
    getData()
  }, [])

  if (!user) {
    return <p>Loading</p>
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