import React, {useEffect, useState} from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "../components/Article.module.scss";
import axios from "axios";
import moment from "moment/moment";


const Scroller = () => {
    const [data, setData] = useState<any>([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchData();


    }, []);


    const handleClick = (link : string) => (event: any) => {

        axios.get('api/article_clicked', {
            params: {
                article_link : link,
            },
        })
    };



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
                        <div className={styles.article} >
                            <a href={link} target={"blank"} className={styles.article_link} onClick={handleClick(link)}>
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
