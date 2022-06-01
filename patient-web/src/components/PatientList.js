import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Table } from "react-bootstrap"

import axios from "axios"
// import { Link } from "react-router-dom"
const PatientList = ({ submitted, setSubmitted }) => {
  let navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [headers, setHeaders] = useState([])

  useEffect(() => {
    const fetchPatientList = () => {
      axios
        .get("/patients")
        .then((res) => {
          // console.log(res)
          setPatients(res.data.patients)
          setHeaders(res.data.headers)
          return res
        })
        .catch((err) => {
          console.log(err.response.data)
          // setErrors(err.response.data)
          navigate("/")
        })
    }
    fetchPatientList()
  }, [navigate])

  return (
    <div>
      <Container>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {headers.map((item, index) => (
                <th key={index}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((row, index) => {
              console.log(row)
              return (
                <tr key={index}>
                  {row.map((cell) => {
                    return <td>{cell}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Container>
    </div>
  )
}

export default PatientList
