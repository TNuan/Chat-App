import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { registerRoute } from '../utils/APIRoutes'

function Register() {
  const navigate = useNavigate()
  const [values, setValue] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }

  useEffect(() => {
    if(localStorage.getItem('chat-app-user')) {
      navigate('/')
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if(handleValidation()) {
      const { password, username, email } = values
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password
      })
      if (data.status === false) {
        toast.error(data.msg, toastOptions)
      }
      if (data.status === true) {
        localStorage.setItem('chat-app-user',JSON.stringify(data.user))
        navigate('/')
      }
    }
  }

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values
    if (password !== confirmPassword) {
      toast.error(
        "password and confirm password should be same! ", 
        toastOptions
      )
      return false
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters", 
        toastOptions
      )
      return false
    } else if (password.length < 8) {
      toast.error(
        "Password should be greater than 8 characters", 
        toastOptions
      )
      return false
    } else if (email === "") {
      toast.error("email is requied", toastOptions)
      return false
    }
    return true
  }

  const handleChange = (event) => {
    setValue({ ...values, [event.target.name]: event.target.value })
  }

  
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>Yalo</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username" onChange={(event) => handleChange(event)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email" onChange={(event) => handleChange(event)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password" onChange={(event) => handleChange(event)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword" onChange={(event) => handleChange(event)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #0C5776;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #001C44;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input { 
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #2D99AE;
      boder-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1 rem;
      &:focus {
        border: 0.1rem solid #2D99AE;
        outline: none;
      }
    }
    button {
      background-image: linear-gradient(to right, #0C5776, #2D99AE);
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-image: linear-gradient(to left, #0C5776, #2D99AE);
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #2D99AE;
        text-decoration: none;
        font-weight: bold;
        &:hover {
          color: #0C5776;
        }
      }
    }
  }

`;

export default Register
