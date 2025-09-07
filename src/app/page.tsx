"use client";
import Link from "next/link";

export default function Menu() {
    const subjects = [
        { id: "udon", name: "うどん" },
        { id: "shio_ramen", name: "塩ラーメン" },
        { id: "omuraisu", name: "オムライス" },
    ];
    
    return (
        <main>
            <h1>学食レビュー</h1>
            <ul>
                {subjects.map((subject) => (
                    <li key={subject.id}>
                        <Link href={`/${subject.id}`}>{subject.name}</Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
