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
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ChevronDown, DownloadIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedUsageGuides, NavigationMenuUsageGuides } from "./nav-guide";

export default function Header() {
  return (
    <header className="flex justify-center w-full sticky top-0 bg-background border-b border-black/5 px-4 z-10">
      <div className="flex w-full max-w-7xl gap-3 justify-between py-4">
        <Link href="/">
          <Image
            src="/wasedule_icon.svg"
            width={36}
            height={36}
            alt="わせジュール"
            className="h-6 lg:h-9"
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
              <li className="ml-2">
                <SheetClose asChild><Link href="/">トップ</Link></SheetClose>
              </li>
              <div className="flex flex-col gap-4">
                <li>
                  <ChevronDown className="inline h-3" />
                  使い方ガイド
                </li>
                <FeaturedUsageGuides />
              </div>
              <li className="ml-2">
                <Link href="/contact">お問い合わせ</Link>
              </li>
              <Link href="/downloads" legacyBehavior passHref>
                <p className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3">
                  <DownloadIcon />
                  <SheetClose>ダウンロード</SheetClose>
                </p>
              </Link>
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