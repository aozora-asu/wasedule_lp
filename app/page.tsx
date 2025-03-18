import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home () {
  return (
    <>
      <header className='flex justify-center w-full sticky'>
        <div className='flex w-full max-w-7xl gap-3 justify-between py-4'>
          <Image
            src='/wasedule_icon.svg'
            width={42}
            height={42}
            alt='わせジュール'
          />
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>使い方ガイド</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    メディア
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    お問い合わせ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
      <main className='flex justify-center'>
        <section className='flex w-full max-w-7xl justify-center items-center gap-12'>
          <div className='my-8'>
            <span className='text-5xl'>
              早稲田生のための
              <br />
              授業課題管理アプリ。
            </span>
            <div className='flex gap-4 my-6'>
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
          <Image
            src='/screenshots/simulator_screenshot_CB3AC48E-3027-41C3-91DA-2698E7A67303-portrait.png'
            width={480}
            height={480}
            alt='わせジュール'
          />
        </section>
      </main>
      <footer className='flex flex-col justify-center items-center px-4 py-8'>
        <section className='flex flex-wrap max-w-7xl'>
          <Link href="" className='p-3 text-sm font-semibold'>プライバシーポリシー</Link>
          <Link href="" className='p-3 text-sm font-semibold'>利用規約</Link>
        </section>
        <section className='w-full max-w-7xl text-end'>
          <p className='text-sm font-semibold'>© 2024 わせジュール</p>
        </section>
      </footer>
    </>
  )
}
