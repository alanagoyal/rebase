"use client";
import AccountForm from "@/components/account";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function Account() {
  const supabase = createClientComponentClient();

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const {
          data: userData,
          error,
          status,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setName(userData?.full_name);
        setEmail(userData?.email);
      }
    };
    getUser();
  }, [supabase, setUser]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-20 py-2">
      <h1 className="text-4xl font-bold mb-4">Your Account</h1>
      {user && <AccountForm user={user.id} name={name} email={email} />}
    </div>
  );
}
