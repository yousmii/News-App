import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "../components/Article.module.scss";
import moment from "moment";

import Scroller from "../components/InfiteScroller"

export default function Homepage() {
    const [username, setUsername] = useState<string | null>(null);

    const user = (event: any) => {
        event.preventDefault()
        axios.get('/api/@me', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setUsername(response.data.username)
                }
                else {
                    console.log("Not logged in")
                }
            })
            .catch(error => {
                console.log(error)
            })
    }


  return (
      <div>
          <div className={styles.container}>
                <Scroller/>

            </div>)
      </div>
  );
}
