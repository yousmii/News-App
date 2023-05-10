import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "../components/Register.module.scss";
import { IoPersonCircle } from "react-icons/io5";

export default function RegisterForm() {
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

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    // include the CSRF token in the form data as a hidden input field
    formData.append("csrf_token", csrfToken);
    // submit the form data to your backend
    const data = {
      username: formData.get("username"),
      email_address: formData.get("email_address"),
      password1: formData.get("password1"),
      password2: formData.get("password2"),
      csrf_token: csrfToken,
    };
    axios
      .post("/api/users", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        //window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.logincontainer}>
        <span className={styles.logo}>
          <IoPersonCircle />
        </span>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="hidden" name="csrf_token" value={csrfToken} />
          <label className={styles.label}>Username:</label>
          <input type="text" name="username" />
          <br />
          <label className={styles.label}>Email address:</label>
          <input type="email" name="email_address" />
          <br />
          <label className={styles.label}>Password:</label>
          <input type="password" name="password1" />
          <br />
          <label className={styles.label}>Confirm password:</label>
          <input type="password" name="password2" />
          <br />
          <input className={styles.button} type="submit" value="Register" />
        </form>
      </div>
    </div>
  );
}
