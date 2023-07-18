"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

type Member = Database["public"]["Tables"]["members"]["Row"];

export function MembersTable({ members }: { members: Member[] }) {
  const supabase = createClientComponentClient();

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Created Time</TableHead>
        </TableRow>
      </TableHeader>
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
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <EditMemberForm member={member} />
                  </TooltipTrigger>
                  <TooltipContent>Edit Link</TooltipContent>
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
                  <TooltipContent>Delete Link</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
