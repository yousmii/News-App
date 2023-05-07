import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../components/Article.module.scss";
import moment from "moment";

import Scroller from "../components/InfiteScroller"

export default function Homepage() {
    const [username, setUsername] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q) {
            setSearchQuery(q);
            handleSearch(q);
        }
    }, []);

    const handleSearch = (query: string) => {
        axios.get('/api/search', {
            params: {
                q: query
            }
        })
            .then(response => {
                setSearchResults(response.data);
            })
            .catch(error => {
                console.log(error)
            })
    }

    const handleClear = () => {
        window.location.href = "/";
    }

    return (
        <div>
            <div>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button onClick={() => handleSearch(searchQuery)}>Search</button>
                <button onClick={handleClear}>Clear</button>
            </div>
            <div className={styles.container}>
                {searchResults ?
                    (
                        <div className={styles.articles}>
                            {searchResults.map(({link, image, title, description, pub_date}: {
                                link: any,
                                title: any,
                                image: any,
                                description: any,
                                pub_date: any,
                            }) => {
                                return (
                                    <div className={styles.article}>
                                        <a href={link} target={"blank"} className={styles.article_link}>
                                            <img className={styles.favicon} height="16" alt={"favicon"} width="16" src={'http://www.google.com/s2/favicons?domain=' + link} />
                                            <img src={image !== null ? image : 'img.png'} alt={title}/>
                                            <h2>{title}</h2>
                                            <p className={styles.description}>{description}</p>
                                            <p className={styles.time_ago}>{moment(pub_date).fromNow()}</p>
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    ) :
                    (
                        <Scroller />
                    )
                }
            </div>
        </div>
    );
}

