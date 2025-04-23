import { Button } from "@/components/ui/button";
import Link from "next/link";

import { getArticles } from "@/lib/microcms";


export default async function GuidePagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { contents } = await getArticles()

  if (!contents) return <span>取得したガイド記事は0件でした。</span>

  return (
    <main className="flex flex-col justify-center items-center gap-12">
      <section className="flex w-full max-w-7xl justify-center items-center flex-col lg:flex-row lg:gap-12">
        <div className="mt-8 mx-2 px-2">
          <div className="flex flex-col gap-6 text-center">
            <span className="text-5xl  lg:text-6xl font-semibold palt">
              使い方ガイド
            </span>
            <span className="break-keep">
              わせジュールの使い方を知ろう。もっと便利に使おう！
            </span>
          </div>
        </div>
      </section>
      <section className="px-4 w-full max-w-7xl ">
        <div className="lg:grid grid-cols-[16rem_1fr]">
          <div className="hidden lg:block sticky top-[128px] h-[calc(100vh-128px)] w-64px-4">
            <ul className="flex flex-col">
              <p className="text-sm font-semibold mx-4 py-1">使い方ガイド</p>
              {contents.map((article) => (
                <Link href={`/guides/${article.id}`} key={article.id}>
                  <Button variant="ghost" className="w-full font-normal text-start whitespace-break-spaces hover:cursor-pointer justify-start my-0.5 hover:font-semibold">
                    {article.title}
                  </Button>
                </Link>
              ))}
            </ul>
          </div>
          <div className="lg:px-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
