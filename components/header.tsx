import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ChevronDown, DownloadIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationMenuUsageGuides from "./nav-guide";

export default function Header() {
  return (
    <header className="flex justify-center w-full sticky top-0 bg-background/80 backdrop-blur-sm backdrop-saturate-200 px-4 z-10">
      <div className="flex w-full max-w-7xl gap-3 justify-between py-4">
        <Link href="/">
          <Image
            src="/wasedule_icon.svg"
            width={36}
            height={36}
            alt="わせジュール"
          />
        </Link>
        <NavigationMenu className="hidden lg:block">
          <NavigationMenuList>
            <NavigationMenuUsageGuides />
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                >
                  お問い合わせ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="https://x.com/wasedule">
                <Button variant="ghost">
                  <Image
                    src="/external-assets/x-logo/logo-black.png"
                    width={24}
                    height={24}
                    alt="公式X - @wasedule"
                    className="p-0.5"
                  />
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="https://www.instagram.com/wasedule/">
                <Button variant="ghost">
                  <Image
                    src="/external-assets/IG_brand_asset_pack_2023/01 Static Glyph/03 Black Glyph/Instagram_Glyph_Black.svg"
                    width={24}
                    height={24}
                    alt="公式Instagram - wasedule"
                  />
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/downloads" legacyBehavior passHref>
                <Button>
                  <DownloadIcon />
                  ダウンロード
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Sheet>
          <SheetTrigger className="lg:hidden">
            <Menu />
          </SheetTrigger>
          <SheetContent className="w-[240px] justify-center px-8">
            <SheetHeader className="p-0">
              <SheetTitle className="text-zinc-300 text-xs">
                ナビゲーションメニュー
              </SheetTitle>
            </SheetHeader>
            <ul className="flex flex-col gap-4 text-sm font-semibold">
              <div className="flex flex-col gap-4">
                <li>
                  <ChevronDown className="inline h-3" />
                  使い方ガイド
                </li>
                <li className="ml-10">
                  <Link href="">自動登録</Link>
                </li>
                <li className="ml-10">
                  <Link href="">課題の管理</Link>
                </li>
                <li className="ml-10">
                  <Link href="">スケジュールの管理</Link>
                </li>
                <li className="ml-10">
                  <Link href="">もっと活用する</Link>
                </li>
              </div>
              <li className="ml-2">
                <Link href="/socials">メディア</Link>
              </li>
              <li className="ml-2">
                <Link href="/contact">お問い合わせ</Link>
              </li>
            </ul>
            <footer className="flex flex-col gap-3 text-zinc-300 text-xs my-8">
              <div className="flex justify-center flex-wrap max-w-7xl gap-4 opacity-15">
                <Link href="">
                  <Image
                    src="/external-assets/x-logo/logo-black.png"
                    width={31}
                    height={31}
                    alt="公式X - @wasedule"
                    className="p-0.5"
                  />
                </Link>
                <Link href="">
                  <Image
                    src="/external-assets/IG_brand_asset_pack_2023/01 Static Glyph/03 Black Glyph/Instagram_Glyph_Black.svg"
                    width={33}
                    height={33}
                    alt="公式Instagram - wasedule"
                  />
                </Link>
              </div>
              <section className="flex flex-wrap gap-3">
                <Link href="">プライバシーポリシー</Link>
                <Link href="">利用規約</Link>
              </section>
              <section className="w-full max-w-7xl text-end">
                <p>© 2024 わせジュール</p>
              </section>
            </footer>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}