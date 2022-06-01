import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Form, Row, Col } from "react-bootstrap"

const Register = (props) => {
  let navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [birthday, setBirthday] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [photo, setPhoto] = useState("")
  const [photoB64, setPhotoB64] = useState("")
  const [appointmentDate, setAppointmentDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [appointmentTime, setAppointmentTime] = useState(
    new Date().toTimeString().split(" ")[0]
  )
  const [errors, setErrors] = useState([])

  const { getPatient } = props

  const handleRegister = (e) => {
    e.preventDefault()
    axios
      .post("/create_user", {
        username,
        password,
        birthday,
        phoneNumber,
        email,
        address,
        photoB64,
        appointmentDate,
        appointmentTime,
      })
      .then((res) => {
        console.log(res)
        getPatient(res.data.username)
        navigate("/dashboard")
      })
      .catch((err) => {
        console.log(err.response.data)
        setErrors(err.response.data)
        navigate("/register")
      })
  }

  const handlePhoto = (e) => {
    setPhoto(e.target.value)
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = (e) => {
      setPhotoB64(e.target.result)
    }
  }

  return (
    <div className='mt-8'>
      <h1 className='mb-5'>Register</h1>
      <Form onSubmit={handleRegister}>
        {/* Username */}
        <Form.Group
          as={Row}
          className='mb-3 justify-content-center'
          controlId='formHorizontalUsername'
        >
          <Form.Label column sm={2}>
            Username
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Col>
        </Form.Group>
        {/* Password */}
        <Form.Group
          as={Row}
          className='mb-3 justify-content-center'
          controlId='formHorizontalPassword'
        >
          <Form.Label column sm={2}>
            Password
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Col>
        </Form.Group>
        {/* Birthday */}
        <Form.Group
          as={Row}
          className='mb-3 justify-content-center'
          // controlId='formHorizontalPassword'
        >
          <Form.Label column sm={2}>
            Birthday
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type='date'
              placeholder='Birthday'
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </Col>
        </Form.Group>
        {/* Phone Number */}
        <Form.Group
          as={Row}
          className='mb-3 justify-content-center'
          // controlId='formHorizontalPhone'
        >
          <Form.Label column sm={2}>
            Phone Number
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type='text'
              placeholder='PhoneNumber'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Col>
        </Form.Group>
        {/* Email */}
        <Form.Group
          as={Row}
          className='mb-3 justify-content-center'
          // controlId='formHorizontalPhone'
        >
          <Form.Label column sm={2}>
            Email
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
        </Form.Group>
        {/* Email */}
        <Form.Group
          as={Row}
          className='mb-3 justify-content-center'
          // controlId='formHorizontalPhone'
        >
          <Form.Label column sm={2}>
            Address
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type='text'
              placeholder='Address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Col>
        </Form.Group>
        {/* Photo (driver license) */}
        <Form.Group
          as={Row}
          className='mb-3 justify-content-center'
          // controlId='formHorizontalPhone'
        >
          <Form.Label column sm={2}>
            Driver license Photo
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type='file'
              placeholder='Driver license Photo'
              value={photo}
              onChange={(e) => handlePhoto(e)}
            />
          </Col>
        </Form.Group>
        {/* Appointment Time */}
        <Form.Group
          as={Row}
          className='mb-3 justify-content-center'
          // controlId='formHorizontalPhone'
        >
          <Form.Label column sm={2}>
            Appointment Time
          </Form.Label>
          <Col sm={2}>
            <Form.Control
              type='date'
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </Col>
          <Col sm='auto'>
            <Form.Control
              type='time'
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
          </Col>
        </Form.Group>
        {/* Error Alert */}
        <Alert show={errors.length === 0 ? false : true} variant='warning'>
          {errors.Error}
        </Alert>
        <Button type='submit' variant='primary'>
          Register
        </Button>
      </Form>
      <hr />
      <small className='text-muted'>
        Already Have An Account?{" "}
        <a
          className='ml-2'
          href='/register'
          onClick={(e) => {
            e.preventDefault()
            navigate("/")
          }}
        >
          Click Here for Sign In
        </a>
      </small>
    </div>
  )
}
export default Register
