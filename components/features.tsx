import { getFeatures } from "@/lib/microcms";
import Image from "next/image";


export default async function Features() {
  const { contents } = await getFeatures()

  if (!contents) return

  return (
    <section className="flex w-full max-w-7xl justify-center items-center flex-col gap-12 lg:gap-24 px-5">
      {contents.map((content) => (
        <article className={`flex flex-col lg:nth-of-type-[even]:flex-row lg:nth-of-type-[odd]:flex-row-reverse gap-4 lg:gap-12`} key={content.id}>
          <Image src={content.image.url} width={Number(content.image.width)} height={Number(content.image.height)} alt="時間割と課題" className="rounded-2xl lg:rounded-4xl lg:max-h-[350px] w-auto" />
          <div className="flex flex-col justify-center gap-4 p-2">
            <h3 className="text-2xl lg:text-3xl font-semibold text-[#4D0F18]">{content.heading}</h3>
            <p className="lg:text-lg">{content.body}</p>
          </div>
        </article>
      ))}
    </section>

  )
}