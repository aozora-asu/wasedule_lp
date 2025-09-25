import { getOthers } from "@/lib/microcms";

export default async function TermsPage() {
  const data = await getOthers();

  return (
    <>
      <main className="flex flex-col justify-center items-center gap-12">
        <section className="flex w-full max-w-7xl justify-center items-center flex-col lg:flex-row lg:gap-12">
          <div className="mt-8 mx-2 px-2">
            <div className="flex flex-col gap-6 text-center">
              <span className="text-5xl  lg:text-6xl font-semibold palt">
                利用規約
              </span>
            </div>
          </div>
        </section>
        <section className="px-4 w-full max-w-7xl">
          <div
            dangerouslySetInnerHTML={{
              __html: `${data.terms}`,
            }}
            className="
        [&>figure>img]:max-h-[600px] 
        [&>figure>img]:w-auto 
        [&>figure>img]:rounded-sm
        [&>p]:pt-6 
        [&>p]:pb-2
        [&>blockquote]:p-6
        [&>blockquote]:my-6
        [&>blockquote]:bg-neutral-100
        [&>blockquote]:rounded-md
        [&>h4]:text-lg
        [&>h4]:font-semibold
        [&>h4]:py-2
        [&>hr]:my-6
        [&_code]:px-2
        [&_code]:rounded-sm
        [&_code]:bg-gray-100
        "
          />
        </section>
      </main>
    </>
  );
}
