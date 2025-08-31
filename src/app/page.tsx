import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
     <div className={styles.main}>
      <h1>授業レビュー</h1>
      <h2>数学演習１</h2>

 {/* 回答を記録するときはformタグを使います */}
 {/*データを保存したいときはsupabaseを使います*/}
      <form action="" className={styles.form}>
        <textarea
          name="content" // addReview関数で取り出すための名前
          rows={4}
          placeholder="レビューを記入してください..."
          required
        />
        <button type="submit" className={styles.button}>
          レビューを投稿
        </button>
  
        </form>
    </div>
  )
  }