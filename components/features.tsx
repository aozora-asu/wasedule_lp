import { getFeatures } from "@/lib/microcms";


export default async function Features() {
  const { contents } = await getFeatures()

  if (!contents) return

  return (
    <section className="flex w-full max-w-7xl justify-center items-center flex-col gap-12 lg:gap-24 px-5">
      {contents.map((content, index) => (
        <article className={`flex flex-col lg:${index % 2 == 0 ? "flex-row-reverse" : "flex-row"} gap-4 lg:gap-12`} key={content.id}>
          <img src={content.image.url} alt="時間割と課題" className="rounded-4xl lg:max-h-[350px] w-auto box-longshadow" />
          <div className="flex flex-col justify-center gap-4 p-2">
            <h3 className="text-2xl lg:text-3xl font-semibold text-[#4D0F18]">{content.heading}</h3>
            <p className="lg:text-lg">{content.body}</p>
          </div>
        </article>
      ))}
    </section>

  )
}