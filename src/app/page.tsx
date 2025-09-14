"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import Image from "next/image";

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

export default function Menu() {
    const subjects = [
        { id: "kake", name: "かけ" },
        { id: "shio_ramen", name: "塩ラーメン" },
        { id: "omuraisu", name: "オムライス" },
    ];

    const [rankedSubjects, setRankedSubjects] = useState<{menu_name: string, average: number}[]>([]);
    
    useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select('*');
            if (!error && data) {
                // 料理ごとに点数を集計（ratingカラムを使用）
                const scores: Record<string, number[]> = {};
                data.forEach((review: Review) => {
                    if (!scores[review.menu_name]) scores[review.menu_name] = [];
                    scores[review.menu_name].push(review.rating);
                });
                // 点数の平均を計算
                const ranked = Object.entries(scores).map(([menu_name, ratings]) => {
                    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                    return { menu_name, average };
                });
                // 点数の高い順にソート
                ranked.sort((a, b) => b.average - a.average);
                setRankedSubjects(ranked);
            }
        };
        fetchReviews();
    }, []);



    return (
        <main className={styles.main}>
            <h1>学食レビュー</h1>
            <h2>料理ランキング（平均点順）</h2>
            <ol>
                {rankedSubjects.map((subject, idx) => (
                    <ul key={subject.menu_name}>
                        {idx + 1}位: {subject.menu_name}（平均点: {subject.average.toFixed(2)}）
                    </ul>
                ))}
            </ol>
            <ul className={styles.ul}>
                {subjects.map((subject) => (
                    <div className="menu-item">
                    <li key={subject.id} className={styles.li}>
                        <Link href={`/${subject.id}`}>{subject.name}</Link>
                        <Image 
                            src={`/images/${subject.id}.webp`} 
                            alt={subject.name} 
                            className={styles.img}
                            width={200}
                            height={150}
                        />
                    </li>
                    </div>
                ))}
            </ul>
        </main>
    )
}