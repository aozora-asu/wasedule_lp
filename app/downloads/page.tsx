import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex flex-col justify-center items-center gap-12">
        <section className="flex w-full max-w-7xl justify-center items-center flex-col lg:flex-row lg:gap-12">
          <div className="mt-8 mx-2 px-2">
            <div className="flex flex-col gap-6 text-center lg:text-start">
              <span className="text-5xl  lg:text-6xl font-semibold palt">
                ダウンロード
              </span>
              <span className="break-keep">
                さあ、わせジュールをダウンロードして、新しい生活を始めよう。
              </span>
            </div>
            <div className="flex flex-wrap gap-4 my-6  justify-center lg:justify-start">
              <Link href={process.env.GOOGLEPLAY_URL ?? ""}>
                <Button>
                  Google Playでダウンロード
                  <ArrowRight />
                </Button>
              </Link>
              <Link href={process.env.APPSTORE_URL ?? ""}>
                <Button>
                  App Storeでダウンロード
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
          <Image
            src="/screenshots/simulator_screenshot_CB3AC48E-3027-41C3-91DA-2698E7A67303-portrait.png"
            width={420}
            height={420}
            alt="わせジュール"
          />
        </section>
      </main>
    </>
  );
}
