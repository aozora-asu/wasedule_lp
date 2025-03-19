import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home () {
  return (
    <>
      <main className='flex flex-col justify-center items-center gap-12'>
        <section className='flex w-full max-w-7xl justify-center items-center flex-col lg:flex-row lg:gap-12'>
          <div className='mt-8 mx-2 px-2'>
            <div className='flex flex-col gap-6 text-center'>
              <span className='text-5xl  lg:text-6xl font-semibold palt'>
                メディア
              </span>
              <span className='break-keep'>
                わせジュールが運営する各SNSアカウント
              </span>
            </div>
          </div>
        </section>
        <section className='px-4'>
          <div className='flex flex-col items-center gap-2'>
            <div className='grid grid-cols-[59px_1fr] h-16 gap-2 w-full max-w-3xl'>
              <div />
              <div className='flex items-center justify-center bg-slate-100 rounded-md p-4'>
                <p>SNSアカウント</p>
              </div>
            </div>
            <Link href='https://x.com/wasedule'>
              <div className='grid grid-cols-[59px_1fr] h-36 gap-2 w-full max-w-3xl'>
                <div className='flex justify-center bg-slate-700 px-3 rounded-md'>
                  <Image
                    src='/external-assets/x-logo/logo-white.png'
                    width={31}
                    height={31}
                    alt='公式X - @wasedule'
                    className='p-0.5 object-contain'
                  />
                </div>
                <div className='grid grid-cols-2 bg-cyan-100 border-[1px] rounded-md overflow-hidden'>
                  <div className='flex flex-col justify-between border-l-4 border-l-cyan-600 p-2'>
                    <p className='p-2'>X (旧Twitter)</p>
                    <p className='bg-background p-1 rounded-sm text-sm font-semibold text-zinc-900'>
                      <ChevronRight className='inline h-3' />
                      @wasedule
                    </p>
                  </div>
                  <div className='bg-background rounded-md p-4'>
                    <p className='text-sm'>
                      アプリに関する更新情報はもちろん、早大生なら知っておくべきお役立ち情報を発信！
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href='https://www.instagram.com/wasedule/'>
              <div className='grid grid-cols-[59px_1fr] h-36 gap-2 w-full max-w-3xl'>
                <div className='flex justify-center bg-slate-700 px-3 rounded-md'>
                  <Image
                    src='/external-assets/IG_brand_asset_pack_2023/01 Static Glyph/02 White Glyph/Instagram_Glyph_White.svg'
                    width={31}
                    height={31}
                    alt='公式X - @wasedule'
                    className='p-0.5 object-contain'
                  />
                </div>
                <div className='grid grid-cols-2 bg-purple-100 border-[1px] rounded-md overflow-hidden'>
                  <div className='flex flex-col justify-between border-l-4 border-l-purple-600 p-2'>
                    <p className='p-2'>Instagram</p>
                    <p className='bg-background p-1 rounded-sm text-sm font-semibold text-zinc-900'>
                      <ChevronRight className='inline h-3' />
                      wasedule
                    </p>
                  </div>
                  <div className='bg-background rounded-md p-4'>
                    <p className='text-sm'>
                      アプリの使い方を中心に新機能追加などもお知らせ！
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
