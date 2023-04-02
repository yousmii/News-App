import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "../components/Article.module.scss";
import moment from "moment";

export default function Homepage() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/articles");
        setData(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data.error);
        }
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
    <div className={styles.container}>
      <div className={styles.articles}>
        {data.map(({link, image, title, description, pub_date}, index) => (
          <div className={styles.article}>
            <a href={link} target={"blank"}>
              <img src={image !== null ? image : 'img.png'} alt={title} />
              <h2>{title}</h2>
              <p className={styles.description}>{description}</p>
              <p className={styles.time_ago}>{moment(pub_date).fromNow()}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
