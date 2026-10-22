import "./register.css"
import { useState } from "react"
import axios from "axios"

export default function Register({ onSwitchToLogin }) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    try {
      const res = await axios.post('https://minimalist-todo-pomodoro-app-backend.onrender.com/api/auth/register', {
        username, 
        email,
        password
      });
      // Siker esetén átválthatunk a loginra vagy beállíthatjuk a state-et
      res.data && alert("Sikeres regisztráció! Kérlek, jelentkezz be.");
      window.location.replace("/");
    } catch(err) {
      setError(true);
    }
  };

  return (
    <div className="register">
      <span className="registerTitle">Regisztráció</span>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>Felhasználó</label>
        <input className="registerInput" type="text" placeholder="felhasználó neve..." onChange={e => setUsername(e.target.value)} />
        <label>Email</label>
        <input className="registerInput" type="text" placeholder="felhasználó email címe..." onChange={e => setEmail(e.target.value)} />
        <label>Jelszó</label>
        <input className="registerInput" type="password" placeholder="jelszó.." onChange={e => setPassword(e.target.value)} />
        <button className="registerButton" type="submit">Regisztráció</button>
      </form>

      {error && <span style={{ color: "red", marginTop: "10px", fontSize: "0.8rem" }}>Valami hiba történt a regisztráció során!</span>}
    </div>
  )
}