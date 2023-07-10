import AccountForm from "@/components/account";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: userData,
    error,
    status,
  } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const name = userData?.full_name;
  const email = userData?.email;

  return (
    <div className="flex flex-col items-center min-h-screen pt-20 py-2">
      <h1 className="text-4xl font-bold mb-4">Your Account</h1>
      <AccountForm user={user!.id!} name={name!} email={email!} />
    </div>
  );
}
