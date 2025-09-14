"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Review型の定義
type Review = {
  id: number;
  text: string;
  menu_name: string;
  rating: number;
  good: number;
};

const subjects = {
  kake: { h2: "かけ" },
  shio_ramen: { h2: "塩ラーメン" },
  omuraisu: { h2: "オムライス" },
};

export default function ReviewPage() {

  const params = useParams(); //URLのidを取得するらしい
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);

  const subject = subjects[params.id as keyof typeof subjects]; //URLのidに対応する情報を取得するらしい

  useEffect(() => {
    if (!subject) return;
    
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
   },[subject?.h2]);

  //存在しないidが指定された場合
  if (!subject) {
    return <div>
      <p>該当するものが見つかりませんでした。</p>
      <Link href="/">戻る</Link>
    </div>;
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };

  const checkReviewLength = (reviewText: string) => {
    if (reviewText.length === 0) {
      alert('ちゃんとレビューを書いてね😢');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!checkReviewLength(reviewText)) {
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            text: reviewText,
            menu_name: subject.h2,
            rating: rating,
            good: 0,
          },
        ]);

      if (error) {
        throw error;
      }

      alert('やったー！😚投稿完了');
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
      alert('残念、投稿失敗😢');
    }
  };

return (
    <div className={styles.main}>
      <h1>学食レビュー</h1>
      <h2>{subject.h2}</h2>

      {/* 回答を記録するときはformタグを使います */}
      {/*データを保存したいときはsupabaseを使います*/}
      <form onSubmit={handleSubmit} className={styles.form}>

        <h2>評価 {rating}</h2>
        <input type="range" min="0" max="5" step="0.5" value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} />

        <textarea
          value={reviewText}
          onChange={handleTextChange}
          rows={12}
          placeholder="ここにレビューを書いてね！"
          required
        />
        <button type="submit" className={styles.button}>
          レビューを投稿
        </button>
      </form>

      <h2>レビュー一覧</h2>
      <ul>
        {reviews.map((review) => ( 
          <li key={review.id}>

            {review.text} (評価: {review.rating})
            <button type="submit" onClick={async () => {
              const { error } = await supabase
                .from('reviews')
                .update({ good: review.good + 1 })
                .eq('id', review.id);
                
                if (error) {
                  console.error('いいね更新エラー:', error);
                  return;
                }
                
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