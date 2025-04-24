import Link from "next/link";
import { getArticles } from "@/lib/microcms";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function StaticPage() {
  const { contents } = await getArticles();

  if (!contents) {
    return <h1>No Contents</h1>;
  }
  const featuredContents = contents.filter((content) => content.category["category-name"] == "Featured")
  const mostFeaturedContents = contents.filter((content) => content.category["category-name"] == "FeaturedMost")

  return (
    <>
      <div>
        <ul className={`grid gap-2 p-2 md:w-[400px] grid-rows-3 grid-cols-[.75fr_1fr]`}>
          <li className="row-span-3">
            <Link
              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
              href={`/guides/${mostFeaturedContents[0].id}`}
            >
              <div className="h-full w-full" >
                <Image src="/auto-reg.png" height={400} width={400} alt="自動登録をイメージしたスクリーンショット" className="w-full h-full object-cover" />
              </div>
              <div className="mb-2 mt-4 text-lg font-medium">
                {mostFeaturedContents[0].title}
              </div>
              <p className="text-sm leading-tight text-muted-foreground">
                {mostFeaturedContents[0].summary}
              </p>
            </Link>
          </li>
          {featuredContents.map((content) => (
            <li key={content.id}>
              <Link
                href="/guides/reg-assignments"
                className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground h-full"
                )}
              >
                <div className="text-sm font-medium leading-none">
                  {content.title}
                </div>
                <p className="line-clamp-3 text-sm leading-snug text-muted-foreground">
                  {content.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

