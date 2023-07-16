"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export default function AuthButton() {
  const supabase = createClientComponentClient();

  async function signInWithGoogle() {
    console.log("in auth button");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteConfig.url}/account/`,
      },
    });
  }

  return (
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
  );
}
