import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center px-4 py-8 gap-8">
      <section
        className="flex items-center
          gap-8 justify-between w-full max-w-7xl mt-16 px-3"
      >
        <Link href="">
          <Image
            src="/wasedule_icon.svg"
            width={36}
            height={36}
            alt="わせジュール"
          />
        </Link>
        <div className="flex flex-wrap max-w-7xl gap-4">
          <Link href="https://x.com/wasedule">
            <Image
              src="/external-assets/x-logo/logo-black.png"
              width={31}
              height={31}
              alt="公式X - @wasedule"
              className="p-0.5"
            />
          </Link>
          <Link href="https://www.instagram.com/wasedule/">
            <Image
              src="/external-assets/IG_brand_asset_pack_2023/01 Static Glyph/03 Black Glyph/Instagram_Glyph_Black.svg"
              width={33}
              height={33}
              alt="公式Instagram - wasedule"
            />
          </Link>
        </div>
      </section>
      <section className="flex flex-col items-start max-w-7xl">
        <Link href="" className="p-3 text-sm font-semibold">
          プライバシーポリシー
        </Link>
        <Link href="" className="p-3 text-sm font-semibold">
          利用規約
        </Link>
      </section>
      <section className="flex justify-between items-center w-full max-w-7xl text-end py-6 border-t-2 border-gray-100">
        <Image
          src="/SVG/aozora-studio_logo-4b.svg"
          width={200}
          height={36}
          alt="Aozora Studio"
        />
        <p className="text-sm font-semibold p-3">© 2025 Aozora Studio</p>
      </section>
    </footer>
  )
}