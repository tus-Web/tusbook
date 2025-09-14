"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
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
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] =useState(5);

  useEffect(() => {
    const fetchReviews = async () => {
      const {data, error} = await supabase
        .from('reviews')
        .select('*')
        .eq('menu_name',subject.h2)
        .order('good',{ ascending: false });

      if(!error && data) {
        setReviews(data);
      }
    };
    fetchReviews();
   },[subject.h2]);

  const handleTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const checkReviewLength = (reviewText: string | any[]) => {
    if (reviewText.length === 0) {
      alert('レビューを記入してください');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    try {
      if (!checkReviewLength(reviewText)) {
        return;
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            text: reviewText,
            menu_name: subject.h2,
            rating: rating,
            good: 0,
          },
        ]);

      alert('投稿完了');
      setReviewText('');
      //投稿後に一覧を再取得
      const { data: newReviews}= await supabase
        .from('reviews')
        .select('*')
        .eq('menu_name',subject.h2)
        .order('good',{ ascending: false});
      setReviews(newReviews || []);
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

        <h2>評価 {rating}</h2>
        <input type="range" min="0" max="5" step="0.5" value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} />

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

      <h2>レビュー一覧</h2>
      <ul>
        {reviews.map((review) => ( 
          <li key={review.id}>

            {review.text} (評価: {review.rating})
            <button type="submit" onClick={async () => {
              const { data,error } = await supabase
                .from('reviews')
                .update({ good: review.good + 1 })
                .eq('id', review.id);
                //再び一覧を取得(ただし順序は変えない)
               const { data: newReviews}= await supabase
                .from('reviews')
                .select('*')
                .eq('menu_name',subject.h2)
                .order('good',{ ascending: false});

                setReviews(newReviews || []);

            }}>いいね</button>(いいね数:{review.good})
          </li>
        ))}
      </ul>

    
      <Link href="/">戻る</Link>
    </div>
  )
}