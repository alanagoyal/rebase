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

type Member = Database["public"]["Tables"]["members"]["Row"];

export function MembersTable({ members }: { members: Member[] }) {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
