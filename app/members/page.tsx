import AddMemberForm from "@/components/add-member";
import { MembersTable } from "@/components/members-table";
import NewMessage from "@/components/new-message";
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

  // Fetch group information
  const { data: groupMappings, error: groupError } = await supabase
    .from("member_group_joins")
    .select("member_id, group_id");

  if (error || groupError) {
    console.error("Error fetching data:", error || groupError);
  }

  // Create a mapping of member IDs to an array of group IDs
  const memberGroupInfo: Record<string, string[]> = {};
  groupMappings?.forEach((groupJoin) => {
    const memberId = groupJoin.member_id;
    const groupId = groupJoin.group_id;
    if (!memberGroupInfo[memberId]) {
      memberGroupInfo[memberId] = [];
    }
    memberGroupInfo[memberId].push(groupId);
  });

  type GroupName = {
    id: string;
    name: string;
  };
  let groupNamesData: any = [];

  if (groupMappings) {
    const groupIds: string[] = groupMappings.map((mapping) => mapping.group_id);
    const { data: groupNamesResponse, error: groupNamesError } = await supabase
      .from("member_groups")
      .select("id, name")
      .in("id", groupIds);

    if (groupNamesResponse) {
      groupNamesData = groupNamesResponse;
    } else {
      groupNamesData = [];
    }
  }

  console.log("groupmappings", groupNamesData, groupMappings);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Members</h2>
        <div className="flex items-center space-x-2">
          <AddMemberForm user={user} />
          <NewMessage  user={user}/>
        </div>
      </div>
      <div className="flex">
        <MembersTable
          members={members!}
          groupMappings={memberGroupInfo}
          groupNamesData={groupNamesData}
        />
      </div>
    </div>
  );
}
