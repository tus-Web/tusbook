"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const subjects = {
  udon: { h2: "うどん" },
  shio_ramen: { h2: "塩ラーメン" },
  omuraisu: { h2: "オムライス" },
};

export default function ReviewPage() {

  //supabaseからデータ取得

  const params = useParams(); //URLのidを取得するらしい
  const subject = subjects[params.id as keyof typeof subjects]; //URLのidに対応する情報を取得するらしい

  //存在しないidが指定された場合
  if (!subject) {
    return <div>
      <p>該当するものが見つかりませんでした。</p>
      <Link href="/">戻る</Link>
    </div>;
  }
  const [reviewText, setReviewText] = useState('');

  const handleTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            text: reviewText,
            menu_name: subject.h2,
          },
        ]);

      if (error) {
        throw error;
      }

      alert('投稿完了');
      console.log(comments);
    }
    catch (error) {
      alert('投稿失敗');
    }
  };

  return (
    <div className={styles.main}>
      <h1>学食レビュー</h1>
      <h2>{subject.h2}</h2>

      {/* 回答を記録するときはformタグを使います */}
      {/*データを保存したいときはsupabaseを使います*/}
      <form action="" className={styles.form}>
        <textarea
          value={reviewText}
          onChange={handleTextChange}
          rows={4}
          placeholder="レビューを記入してください..."
          required
        />
        <button type="submit" className={styles.button} onClick={handleSubmit}>
          レビューを投稿
        </button>
      </form>

      <h2>コメント</h2>


      <Link href="/">戻る</Link>
    </div>
  )
}