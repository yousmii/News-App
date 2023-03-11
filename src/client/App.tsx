import React, {useState, useEffect} from "react";
import Header from "./components/Header";
import styles from "./components/Article.module.scss"

function App() {
    const [data, setData] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/data');
            const jsonData = await response.json();
            setData(jsonData);
        }

        fetchData();
    }, []);

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
