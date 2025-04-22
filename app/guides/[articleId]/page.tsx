import { getDetail, getArticles } from "@/lib/microcms";

export async function generateStaticParams() {
  const { contents } = await getArticles();

  const paths = contents.map((blog) => {
    return {
      blogId: blog.id,
    };
  });
  return [...paths];
}

export default async function StaticDetailPage({
  params: { articleId },
}: {
  params: { articleId: string };
}) {
  const blog = await getDetail(articleId);

  return (
    <>
      <h3 className="text-2xl font-semibold py-16">{blog.title}</h3>
      <div
        dangerouslySetInnerHTML={{
          __html: `${blog.body}`,
        }}
        className="
        [&>figure>img]:max-h-[600px] 
        [&>figure>img]:w-auto 
        [&>p]:pt-6 
        [&>p]:pb-2
        [&>blockquote]:p-6
        [&>blockquote]:my-6
        [&>blockquote]:bg-neutral-100
        [&>blockquote]:rounded-md
        "
      />
    </>
  )
}

