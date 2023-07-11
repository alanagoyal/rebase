import MemberForm from "@/components/member-form";
import { MembersTable } from "@/components/members-table";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Members() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const {
    data: members,
    error,
    status,
  } = await supabase.from("members").select("*").eq("created_by", user.id);

  return (
    <div>
      <MemberForm user={user} />
      <MembersTable members={members!} />
    </div>
  );
}
