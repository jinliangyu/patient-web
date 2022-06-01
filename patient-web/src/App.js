import "./App.css"
import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import PatientList from "./components/PatientList"
import Register from "./components/Register"
import TopBar from "./components/TopBar"

function App() {
  const [patient, setPatient] = useState("")
  const getPatient = (patient) => {
    setPatient(patient)
    localStorage.setItem("currentUser", patient)
  }
  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      setPatient(localStorage.getItem("currentUser"))
    }
  }, [])

  const resetPatient = () => {
    console.log("reset")
    setPatient("")
    localStorage.setItem("currentUser", "")
  }

  return (
    <div className='App'>
      <TopBar patient={patient} resetPatient={resetPatient} />
      <Routes>
        <Route
          path='/'
          element={
            <Login getPatient={getPatient} resetPatient={resetPatient} />
          }
        ></Route>
        <Route path='/dashboard' element={<PatientList />}></Route>
        <Route
          path='/register'
          element={<Register getPatient={getPatient} />}
        ></Route>
      </Routes>
    </div>
  )
}

export default App
