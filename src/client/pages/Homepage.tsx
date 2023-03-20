import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../components/Article.module.scss";

export default function Homepage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api");
        setData(response.data);
      } catch (error) {
        setError(error.response.data.error);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.articles}>
        {data.map((item, index) => (
          <div className={styles.article}>
            <a href={item.link} target={"blank"}>
              <img src={item.image} alt={item.title} />
              <h2>{item.title}</h2>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
