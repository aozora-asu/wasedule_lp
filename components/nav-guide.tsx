import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import { getArticles } from "@/lib/microcms";
import { Button } from "./ui/button";

export default async function NavigationMenuUsageGuides() {
  const { contents } = await getArticles()

  if (!contents) {
    return <Button variant="ghost" disabled>使い方ガイド</Button>
  }
  const featuredContents = contents.filter((content) => content.category["category-name"] == "Featured")
  const mostFeaturedContents = contents.filter((content) => content.category["category-name"] == "FeaturedMost")

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>使い方ガイド</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-2 p-2 md:w-[400px] lg:grid-cols-[.75fr_1fr]">
          <li className={`row-span-${featuredContents.length}`}>
            <NavigationMenuLink asChild>
              <Link
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                href={`/guides/${mostFeaturedContents[0].id}`}
              >
                <div className="h-full w-full" >
                  <Image src="/auto-reg.png" height={400} width={400} alt="自動登録をイメージしたスクリーンショット" />
                </div>
                <div className="mb-2 mt-4 text-lg font-medium">
                  {mostFeaturedContents[0].title}
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  {mostFeaturedContents[0].summary}
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
          {featuredContents.map((content) => (
            <li key={content.id}>
              <NavigationMenuLink asChild>
                <Link
                  href="/guides/reg-assignments"
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  <div className="text-sm font-medium leading-none">
                    {content.title}
                  </div>
                  <p className="line-clamp-4 text-sm leading-snug text-muted-foreground">
                    {content.summary}
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}