import { createClient } from 'microcms-js-sdk';

export type Blog = {
    id: string;
    title: string;
    body: string;   
}

if (!process.env.MICROCMS_DOMAIN) {
    throw new Error("MICROCMS_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
    throw new Error("MICROCMS_API_KEY is required");
}

export const client = createClient({
    serviceDomain: process.env.MICROCMS_DOMAIN,
    apiKey: process.env.MICROCMS_API_KEY ,
});

// 記事一覧を取得
export const getArticles = async () => {
    const articles = await client.getList<Blog>({
    endpoint: "guides"
    });
    return articles;
}

// 記事の詳細を取得
export const getDetail = async (contentId: string) => {
    const blog = await client.getListDetail<Blog>({
        endpoint: "guides",
        contentId,
    });
    return blog;
};


