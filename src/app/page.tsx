"use client";
import Link from "next/link";
import styles from "./page.module.css";

export default function Menu() {
    const subjects = [
        { id: "udon", name: "うどん" },
        { id: "shio_ramen", name: "塩ラーメン" },
        { id: "omuraisu", name: "オムライス" },
    ];

    return (
        <main　className={styles.main}>
            <h1>学食レビュー</h1>
            <ul　className={styles.ul}>
                {subjects.map((subject) => (
                    <li key={subject.id} className={styles.li}>
                        <Link href={`/${subject.id}`}>{subject.name}</Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}