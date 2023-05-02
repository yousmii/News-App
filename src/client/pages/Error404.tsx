import styles from "../components/Error404.module.scss";

export default function Error404() {
  return (
    <div>
      <div className={styles.errorcontainer}>
        <img
          src="/error404.png"
          alt="404 Error"
          className={styles.errorimage}
        />
        <a href="/" className={styles.errorlink}>
          Back to home page
        </a>
      </div>
    </div>
  );
}
