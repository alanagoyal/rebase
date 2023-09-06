"use client";

import { Database } from "@/types/supabase";
import { Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import EditMemberForm from "./edit-member";
import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFoot,
  TableFooterCell,
} from "@tremor/react";

type Member = Database["public"]["Tables"]["members"]["Row"];
type GroupMappings = Record<string, string[]>;
type GroupName = {
  id: number;
  name: string;
};

export function MembersTable({
  members,
  groupMappings,
  groupNamesData,
}: {
  members: Member[];
  groupMappings: GroupMappings;
  groupNamesData: GroupName;
}) {
  const supabase = createClientComponentClient();
  const [groupMemberships, setGroupMemberships] = useState<
    Record<string, string>
  >({});

  const router = useRouter();

  async function onDelete(id: string) {
    try {
      let { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
      toast({
        description: "Your member has been deleted",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const groupMemberships: Record<string, string> = {};
    members.forEach((member) => {
      if (groupMappings[member.id]) {
        const formattedMembership = groupMappings[member.id]
          .map((groupId) => {
            const matchingGroup = groupNamesData.find(
              (group) => group.id === groupId
            ) as GroupName;
            return matchingGroup ? matchingGroup.name : null;
          })
          .filter(Boolean)
          .join(", ");
        groupMemberships[member.id] = formattedMembership || "None";
      } else {
        groupMemberships[member.id] = "None";
      }
    });

    setGroupMemberships(groupMemberships);
  }, [members, groupMappings, groupNamesData]);

  console.log("groupMappings", groupMappings);
  console.log("groupNamesData", groupNamesData);

  console.log("members", members);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell className="w-[100px]">Name</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
          <TableHeaderCell>Created Time</TableHeaderCell>
          <TableHeaderCell>Group</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {members.map((member: any) => (
          <TableRow key={member.id}>
            <TableCell>
              {member.first_name} {member.last_name}
            </TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>
              {new Date(member.created_at).toLocaleString("en-US")}
            </TableCell>
            <TableCell>{groupMemberships[member.id]}</TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <EditMemberForm
                      existingGroups={groupMemberships[member.id]}
                      member={member}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Edit Member</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Trash
                      className="h-4 w-4 ml-4 text-muted-foreground"
                      onClick={() => onDelete(member.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Delete Member</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
