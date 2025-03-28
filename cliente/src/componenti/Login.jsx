import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '/css/login.css'
export function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://vercel-deploy-server-amber.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        setMessage("Credenziali errate");
        return;
      }
      const responseData = await response.json();
      
      localStorage.setItem("userId", responseData.userId);
      setMessage(
        "login effettuato con successo, stai per essere reindirizzato nella home..."
      );
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      setMessage(error.message);
    }

    setData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="login-body">
      <form onSubmit={handleSubmit} className="form">
      <img src="/meteoo.png" width={240} alt="logo" />
        <h3>Login</h3>

        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Inserisci la tua Email..."
        />
        <label> Password:</label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
          placeholder="Inserisci la tua password..."
        />
        <button type="submit">Login</button>
        <p>
          Non sei ancora registrato?{" "}
          <Link to={"/registrazione"}>Registrati!</Link>
        </p>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
