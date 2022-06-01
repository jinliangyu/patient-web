import React from "react"
import { Container, Navbar, Button } from "react-bootstrap"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const TopBar = (props) => {
  let navigate = useNavigate()
  // const [errors, setErrors] = useState([])
  const { patient, resetPatient } = props

  const handleLogout = (e) => {
    e.preventDefault()
    axios
      .post("/logout")
      .then((res) => {
        console.log(res)
        resetPatient()
        navigate("/")
      })
      .catch((err) => {
        console.log(err.response.data)
        navigate("/")
      })
  }

  return (
    <div>
      <Navbar bg='dark' variant='dark' className='mb-5'>
        <Container>
          <Navbar.Brand href='/'>PatientWeb</Navbar.Brand>
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text className='mx-3'>{patient}</Navbar.Text>
            <Button variant='success' onClick={(e) => handleLogout(e)}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default TopBar
