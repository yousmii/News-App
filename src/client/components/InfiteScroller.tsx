import React, {useEffect, useState} from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "../components/Article.module.scss";
import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment/moment";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;


const Scroller = () => {
    const [data, setData] = useState<any>([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
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
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await axios.get(
            '/api/articles', {
                params: {
                    offset: skip
                }
            }
        );
        if (response.data.length > 0) {
            // Group articles by similarity
            const groups = await Promise.all(response.data.map(async (article: any) => {
                const similarArticles = await axios.get(`/api/similarity/`, {
                        params: {
                            article_link: article["link"]
                        }
                    }
                );
                return {
                    article,
                    similarArticles: similarArticles.data.filter((link: any) => link !== article.link)
                };
            }));

            // Filter out duplicates
            const filteredGroups = groups.filter((group, index) => {
                for (let i = 0; i < index; i++) {
                    if (groups[i].similarArticles.includes(group.article.id)) {
                        return false;
                    }
                }
                return true;
            });

            // Add link to view all articles in each group
            const newData = filteredGroups.map((group) => ({
                ...group.article,
                similarArticles: group.similarArticles
            }));

            setData(data.concat(newData));
            setSkip(skip + 10);
        } else {
            setHasMore(false);
        }
    };

    const TrackHistory = (link: string)  => {
       const linkData = {
           link: link
       }
       axios.put('/api/articles/view', linkData, {
           headers: {
               'Content-Type': 'application/json'
           }
       }).catch(error => {
           console.log(error)
       })
       console.log(username)
       if (username !== null) {
           axios.post('/api/history', linkData, {
               headers: {
                   'Content-Type': 'application/json'
               }
           }).catch(error => {
               console.log(error)
           })
       }
       else {
           if (!Cookies.get("history_index")) {
               Cookies.set("history_index", "0");
           }
           let AddCookie: boolean = false;
           if (Cookies.get("history_"+Cookies.get("history_index")) === undefined) {
               let array : string[] = []
               Cookies.set("history_"+Cookies.get("history_index"), JSON.stringify(array));
           }
           let cookieValue = Cookies.get("history_" + Cookies.get("history_index"))
           if (typeof cookieValue === "string") {
               let Cookie_history = JSON.parse(cookieValue);
               Cookie_history.push(link);
               if (Cookie_history.length > 100) {
                   AddCookie = true
               }
               Cookies.set("history_" + Cookies.get("history_index"), JSON.stringify(Cookie_history));
           }
           let indexValue = Cookies.get("history_index")
           if (typeof indexValue === "string" && AddCookie) {
               let newIndex : string = indexValue + 1;
               Cookies.set("history_index", newIndex);
           }
       }
    };

    return (
        <InfiniteScroll
            dataLength={data.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
                <p style={{textAlign: 'center'}}>
                    <b>End of feed</b>
                </p>
            }
        >
            <div className={styles.articles}>
                {data.map(({link, image, title, description, pub_date, similarArticles}: {
                    link: any,
                    title: any,
                    image: any,
                    description: any,
                    pub_date: any,
                    similarArticles: any
                }) => {
                    return (
                        <div key={link} onClick={() => TrackHistory(link)} className={styles.article}>
                            <a href={link} target={"blank"} className={styles.article_link}>
                                <img className={styles.favicon} height="16" alt={"favicon"} width="16" src={'http://www.google.com/s2/favicons?domain=' + link} />
                                <img src={image !== null ? image : 'img.png'} alt={title}/>
                                <h2>{title}</h2>
                                <p className={styles.description}>{description}</p>
                                <p className={styles.time_ago}>{moment(pub_date).fromNow()}</p>
                            </a>
                            {similarArticles.length > 0 && (
                                <p>
                                    Also published by:{' '}
                                    {similarArticles.map((similarArticleId: any) => (
                                        <React.Fragment key={similarArticleId}>
                                            <a href={`${similarArticleId}`} target="_blank"
                                               rel="noopener noreferrer" className={styles.published_by}>
                                                <img src={'http://www.google.com/s2/favicons?domain=' + similarArticleId} alt='favicon' className={styles.favicon}/>
                                            </a>
                                        </React.Fragment>
                                    ))}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        </InfiniteScroll>
    );
};

export default Scroller;