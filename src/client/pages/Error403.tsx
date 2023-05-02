import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { redirect } from "react-router-dom";
import styles from "../components/Error403.module.scss";

export default function Error403() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.errorcontainer}>
        <img
          src="/error403.png"
          alt="404 Error"
          className={styles.errorimage}
        />
        <a href="/" className={styles.errorlink}>
          Back to home page
        </a>
      </div>
    </div>
  );
}
