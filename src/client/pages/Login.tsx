import styles from "../components/Login.module.scss";
import React from "react";
import { IoPersonCircle } from "react-icons/io5";

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.logincontainer}>
        <span className={styles.logo}>
          <IoPersonCircle />
        </span>
        <form className={styles.form} method="post">
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
          <input className={styles.button} type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
}
