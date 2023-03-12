import React, {useState, useEffect} from "react";
import Header from "./components/Header";
import styles from "./components/Article.module.scss"
import axios from 'axios';

function App() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('/api');
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
                <Header/>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div>
            <Header/>
            <div className={styles.articles}>
                {data.map((item, index) => (
                    <div className={styles.article}>
                        <a  href={item.link}target={'blank'}>
                            <img src={item.image} alt={item.title}/>
                            <h2>{item.title}</h2>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
