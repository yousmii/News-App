import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "../components/Article.module.scss";
import moment from "moment";

import Scroller from "../components/InfiteScroller"

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
      <Scroller/>

    </div>
  );
}
