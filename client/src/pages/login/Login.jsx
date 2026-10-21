import React from 'react'
import "./login.css"
import { Link } from "react-router-dom"
import { useRef, useContext } from "react";
import { Context } from "../../context/Context";
import axios from "axios";

export default function Login() {
  
  const userRef = useRef();
  const passwordRef = useRef();
  const { dispatch, isFetching, error } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      // Itt használhatod a Renderes címet, pont úgy, mint a Home.jsx-ben:
      const res = await axios.post('https://minimalist-todo-pomodoro-app-backend.onrender.com/api/auth/login', {
        username: userRef.current.value,
        password: passwordRef.current.value,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };

  return (
    <div className="login">
      <span className="loginTitle">Bejelentkezés</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Felhasználó</label>
        <input className="loginInput" type="text" placeholder="felhasználó név..." ref={userRef} />
        <label>Jelszó</label>
        <input className="loginInput" type="password" placeholder="jelszó..." ref={passwordRef} />
        <button className="loginButton" type="submit" disabled={isFetching}>Bejelentkezés</button>
        {error && <span className="loginError" style={{color: "red", marginTop: "10px"}}> Hibás felhasználói név vagy jelszó!</span>}
      </form>
  
    </div>
  )
}