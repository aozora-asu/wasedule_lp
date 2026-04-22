"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TermsPage() {
  const [copied, setCopied] = useState(false);

  const templateText = `【わせジュールサークル検索掲載申請】
サークル名: [ご自身のサークル名]
公認: [はい / いいえ]
以上を申請します`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(templateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <main className="flex flex-col justify-center items-center gap-12">
        <section className="flex w-full max-w-7xl justify-center items-center flex-col lg:flex-row lg:gap-12">
          <div className="mt-8 mx-2 px-2">
            <div className="flex flex-col gap-6 text-center py-16">
              <span className="text-3xl  lg:text-4xl font-semibold palt">
                わせジュールサークル検索登録について
              </span>
            </div>
          </div>
        </section>
        <section className="px-4 w-full max-w-7xl flex flex-col gap-6">
          <p>
            この度はわせジュールのサークル検索機能にご関心をお寄せいただき、ありがとうございます。
            <br />
            このページでは早稲田大学のサークル（公認・非公認）の方を対象に、所属するサークルの情報をわせジュールのサークル検索に登録する方法についてご案内いたします。
          </p>
          <p>
            わせジュールサークル検索機能は2026年3月中にアップデートで追加予定で、情報登録は随時受け付けております。
          </p>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">
              わせジュールサークル検索で実現予定の機能
            </h2>
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>基本的なサークル情報の閲覧 (3月下旬)</li>
              <li>新歓カレンダーの配信 (3月下旬)</li>
              <li>Instagram投稿の自動掲載 (3月下旬)</li>
              <li>
                サークルに興味を持った新入生へのプッシュ通知発信 (4月上旬)
              </li>
              <li>
                公開予定のサークル向け管理アプリを通じたサークル活動の自動発信
                (5月中旬)
              </li>
            </ul>
            <p>順次機能を追加予定です。ご期待ください。</p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">
              わせジュールサークル検索の登録方法
            </h2>

            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold">
                A. 学生会館に部室をお持ちの公認サークルの方々
              </h3>
              <div className="rounded-lg bg-zinc-100 p-4">
                <p>
                  💡
                  部室のポストに投函されているご案内に添付のパスワードを使用して管理画面にアクセスできます
                </p>
              </div>
              <p>
                単独部室・曜日指定部室を問わず、学生会館に部室をお持ちの各公認サークル様には、部室入り口ドア横のポストに、掲載のご案内を投函させていただいております。
                <br />
                投函資料にホチキス留めされている紙にログイン用のパスワードを記載しておりますので、以下のサイトから情報を登録してください。
              </p>
              <p className="text-sm">
                ※投函が確認できない場合、
                <Link
                  href="https://www.instagram.com/waseda_winc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  「情報技術研究会(WINC)」のInstagram
                </Link>
                にダイレクトメッセージでお問い合わせください。
              </p>
            </div>
            <Button asChild className="self-start">
              <Link
                href="https://admin.unit.winc.ne.jp/posting"
                target="_blank"
                rel="noopener noreferrer"
              >
                公認サークル向け管理画面ログインはこちら
              </Link>
            </Button>

            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold">
                B. 部室をお持ちでない公認サークルの方々，非公認サークルの方々
              </h3>
              <div className="rounded-lg bg-zinc-100 p-4">
                <p>
                  💡
                  Instagramのダイレクトメッセージで編集したい旨をお申し付けください
                </p>
              </div>
              <p>
                <Link
                  href="https://www.instagram.com/waseda_winc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  「情報技術研究会(WINC)」のInstagram
                </Link>
                にダイレクトメッセージで、編集したい旨をお申し付けください。
                <br />
                必要に応じて以下のお問い合わせ用のテンプレートをご利用ください。
              </p>
              <div className="relative">
                <blockquote className="border-l-4 border-zinc-400 pl-4 py-2">
                  【わせジュールサークル検索掲載申請】
                  <br />
                  サークル名: [ご自身のサークル名]
                  <br />
                  公認: [はい / いいえ]
                  <br />
                  以上を申請します
                </blockquote>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="absolute top-0 right-0"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
