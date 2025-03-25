"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactEmail } from "@/actions/send-email";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "２文字以上でご記入ください。",
  }),
  email: z.string().email({ message: "無効なメールアドレスです。" }),
  body: z.string(),
});

export default function Home() {
  const [state, setState] = useState("waiting");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      body: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    sendContactEmail({
      name: values.username,
      email: values.email,
      body: values.body,
    });
    setState("sent");
  }

  return (
    <>
      <main className="flex flex-col justify-center items-center gap-12">
        <section className="flex w-full max-w-7xl justify-center items-center flex-col lg:flex-row lg:gap-12">
          <div className="mt-8 mx-2 px-2">
            <div className="flex flex-col gap-6 text-center">
              <span className="text-5xl  lg:text-6xl font-semibold palt">
                お問い合わせ
              </span>
              <span className="break-keep">
                わせジュール運営へのご質問・ご要望などはこちらから
              </span>
            </div>
          </div>
        </section>
        <section className="px-4">
          <div className="flex flex-col items-center gap-2">
            {state === "waiting" ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full px-8 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>お名前</FormLabel>
                        <FormControl>
                          <Input placeholder="山田太郎" {...field} />
                        </FormControl>
                        <FormDescription>
                          ご自身のお名前を入力してください
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>メールアドレス</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          返信の際に宛先として使用するメールアドレスを入力してください
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>お問い合わせ内容</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="ここにご用件をご記入ください"
                            rows={5}
                            className="h-8"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          可能な限り早めにご対応いたしますが、お返事にはお時間をいただく場合があります。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">送信</Button>
                </form>
              </Form>
            ) : (
              <div className="w-full flex flex-col items-center justify-center text-center">
                <CheckCircle2 />
                <h3 className="text-lg font-semibold">送信しました</h3>
                <p className="text-muted-foreground text-sm m-8">
                  可能な限り早めにご対応いたしますが、お返事にはお時間をいただく場合があります。
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
