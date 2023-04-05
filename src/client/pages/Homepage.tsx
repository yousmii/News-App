import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "../components/Article.module.scss";
import moment from "moment";

import Scroller from "../components/InfiteScroller"

export default function Homepage() {



  return (
    <div className={styles.container}>
      <Scroller/>

    </div>
  );
}
