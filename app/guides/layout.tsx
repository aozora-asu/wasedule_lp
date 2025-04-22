import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <div className="grid grid-cols-[16rem_1fr]">
          <div className="w-64 border-r-2 border-gray-100 px-4">
            <ul className="flex flex-col">
              <Link href="./auto-reg"><Button variant="ghost" className="w-full justify-start my-0.5 hover:font-bold">自動登録</Button></Link>
            </ul>
          </div>
          <div className="px-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
