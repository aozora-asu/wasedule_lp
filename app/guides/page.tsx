import Link from "next/link";
import { getArticles } from "@/lib/microcms";

export default async function StaticPage() {
  const { contents } = await getArticles();

  if (!contents) {
    return <h1>No Contents</h1>;
  }

  return (
    <>
      <div>
        <ul>
          {contents.map((article) => (
            <li key={article.id}>
              <Link href={`/guides/${article.id}`}>{article.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

