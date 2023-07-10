"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default async function Index() {
  const supabase = createClientComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteConfig.url}/account/`,
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto my-48 flex-grow">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
              {siteConfig.name}
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              {siteConfig.description}
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={signInWithGoogle}
              className=" text-white px-8 py-4 rounded-md text-base"
              style={{
                background: "linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)",
              }}
            >
              Get Started
            </Button>
            <Link
              href={siteConfig.links.github}
              className={buttonVariants({ variant: "ghost" })}
            >
              View on Github
            </Link>
          </div>
        </section>
      </main>

      <footer className="text-center py-8">
        {" "}
        <div className="text-center mb-2">
          <p>
            Built with <span className="text-red-500">❤️</span> by{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.authorName}
            </a>{" "}
          </p>
        </div>
      </footer>
    </div>
  );
}
