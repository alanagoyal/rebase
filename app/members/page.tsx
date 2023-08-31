import AddMemberForm from "@/components/add-member";
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

  // const {
  //   data: members,
  //   error,
  //   status,
  // } = await supabase
  //   .from("members")
  //   .select(
  //     `
  //       id,
  //       email,
  //       first_name,
  //       last_name,
  //       created_at,
  //       created_by,
  //       member_groups:group (
  //         id,
  //         name
  //       )
  //     `
  //   )
  //   .eq("created_by", user.id);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Members</h2>
        <div className="flex items-center space-x-2">
          <AddMemberForm user={user} />
        </div>
      </div>
      <div className="flex">
        <MembersTable members={members!} />
      </div>
    </div>
  );
}
