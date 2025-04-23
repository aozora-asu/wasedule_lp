import MockupCarousel from "@/components/mockup-carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const hoge = new Date(1739060973345)
  console.log(hoge)
  return (
    <>
      <main className="flex justify-center">
        <section className="flex w-full max-w-7xl justify-center items-center flex-col lg:flex-row lg:gap-12">
          <div className="mt-8 mx-2 px-2">
            <div className="flex flex-col gap-6 text-center lg:text-start">
              <span className="text-5xl  lg:text-6xl font-semibold palt">
                <b>落単しない</b>ための
                <br />
                スケジュール
                <br />
                アプリ
              </span>
              <span className="break-keep">
                早稲田生のための授業課題管理アプリ、<b>わせジュール</b>。
              </span>
            </div>
            <div className="flex flex-wrap gap-4 my-6  justify-center lg:justify-start">
              <Button>
                Google Playでダウンロード
                <ArrowRight />
              </Button>
              <Button>
                App Storeでダウンロード
                <ArrowRight />
              </Button>
            </div>
          </div>
          <MockupCarousel />
        </section>
      </main>
    </>
  );
}
