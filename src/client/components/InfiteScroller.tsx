import React, {useEffect, useState} from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "../components/Article.module.scss";
import axios from "axios";
import moment from "moment/moment";


const App = () => {
  const [data, setData] = useState<any>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await axios.get(
      '/api/articles'
    );
    if (response.data.length > 0) {
      setData(response.data);
      setSkip(skip + 10);
    } else {
      setHasMore(false);
    }
  };

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <div className={styles.articles}>
        {data.map(({link, image, title, description, pub_date} : {link : any, title : any, image : any , description : any, pub_date : any}, index : any) => (
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
    </InfiniteScroll>
  );
};
