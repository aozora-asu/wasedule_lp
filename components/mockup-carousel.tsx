"use client"
import Image from "next/image";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export default function MockupCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 1500 })]
  )

  const screenshots = [
    "時間割.png",
    "単位A.png",
    "単位B.png",
    "残機A.png",
    "残機B.png",
    "スケジュール.png",
  ]

  return (
    <div className="max-w-[340px] lg:max-w-[420px] bg-[url(/screenshot-frame.png)] bg-contain p-[15px] lg:mt-3 lg:p-[20px] [&>div]:rounded-[48px] lg:[&>div]:rounded-[56px] overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="flex">
          {screenshots.map((file) => (
            <div className="embla__slide" key={file}>
              <Image
                src={`/screenshots/${file}`}
                width={420}
                height={420}
                alt="わせジュール"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
