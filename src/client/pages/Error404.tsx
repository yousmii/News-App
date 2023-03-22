import styles from "../components/Error404.module.scss";

export default function Error404() {
    return (
            <div >
                <div className={styles.errorcontainer}>
                    <h1 className={styles.errorheading}>Error 404: Page not found</h1>
                    <p className={styles.errormessage}>The page you are looking for does not exist.</p>
                    <img src="/error404.png" alt="404 Error" className={styles.errorimage}/>
                    <a href="/" className={styles.errorlink}>Return to Home</a>
            </div>
        </div>
    )
}