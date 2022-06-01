import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Form, Row, Col } from "react-bootstrap"

const Login = (props) => {
  let navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState([])

  const { getPatient, resetPatient } = props

  const handleLogin = (e) => {
    e.preventDefault()
    axios
      .post("/login", { username, password }, { timeout: 1000 })
      .then((res) => {
        console.log(res)
        getPatient(res.data.username)
        navigate("/dashboard")
      })
      .catch((err) => {
        resetPatient()
        console.log(err.response.data)
        setErrors(err.response.data)
        navigate("/")
      })
  }

  return (
    <div className='mt-8'>
      <h1 className='mb-5'>Sign In</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group
          as={Row}
          className='mb-3 justify-content-center'
          controlId='formHorizontalUsername'
        >
          <Form.Label column sm={1}>
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

        <Form.Group
          as={Row}
          className='mb-3 justify-content-center'
          controlId='formHorizontalPassword'
        >
          <Form.Label column sm={1}>
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
        <Button type='submit' variant='primary'>
          Sign In
        </Button>
      </Form>
      {/* Error Alert */}
      <Alert show={errors.length === 0 ? false : true} variant='warning'>
        {errors.Error}
      </Alert>
      <hr />
      <small className='text-muted'>
        Don't Have An Account?{" "}
        <a
          className='ml-2'
          onClick={(e) => {
            e.preventDefault()
            navigate("/register")
          }}
          href='/'
        >
          Click Here for Register
        </a>
      </small>
    </div>
  )
}
export default Login
