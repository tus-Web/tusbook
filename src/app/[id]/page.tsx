"use client";
import styles from "./page.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";


const subjects = {
  udon: { h2: "うどん" },
  shio_ramen: { h2: "塩ラーメン" },
  omuraisu: { h2: "オムライス" },
};

export default function ReviewPage() {
  const params = useParams(); //URLのidを取得するらしい
  const subject = subjects[params.id as keyof typeof subjects]; //URLのidに対応する情報を取得するらしい

  if (!subject) {
    return <div>
        <p>該当するものが見つかりませんでした。</p>
        <Link href="/">戻る</Link>
    </div>;
  }

  return (
     <div className={styles.main}>
      <h1>学食レビュー</h1>
      <h2>{subject.h2}</h2>

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
        <Link href="/">戻る</Link>
    </div>
  )
    }