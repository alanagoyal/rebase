import * as React from "react";
import Link from "next/link";
import { User, Mail } from "lucide-react";
import { NavItem } from "@/types/nav";
import { cn } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SecondaryNavProps {
  items?: NavItem[];
}

export function SecondaryNav(user: any, { items }: SecondaryNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title === "Members" && <User className="w-6 h-6 p-1" />}
                  {item.title === "Mailbox" && <Mail className="w-6 h-6 p-1" />}
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  );
}
