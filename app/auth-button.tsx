"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
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
