import styles from "../components/Login.module.scss";
import React, { useEffect, useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login() {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // fetch the CSRF token from your backend
    axios
      .get("/api/csrf_token")
      .then((response) => {
        setCsrfToken(response.data.csrf_token);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleLogin = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    // include the CSRF token in the form data as a hidden input field
    formData.append("csrf_token", csrfToken);
    // submit the form data to your backend
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      csrf_token: csrfToken,
    };
    axios
      .post("/api/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          window.location.href = "/";
        } else if (response.status === 400) {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.logincontainer}>
        <span className={styles.logo}>
          <IoPersonCircle />
        </span>
        <form className={styles.form} onSubmit={handleLogin}>
          <label className={styles.label}>Username:</label>
          <input
            title="username"
            type="text"
            id="username"
            name="username"
            required
          />
          <br />
          <label className={styles.label}>Password:</label>
          <input
            title="password"
            type="password"
            id="password"
            name="password"
            required
          />
          <br />
          <div className={styles.login_and_register_buttons}>
            <input className={styles.button} type="submit" value="Login" />
            <Link to={"/register"}>
              <button className={styles.register}>Register</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
