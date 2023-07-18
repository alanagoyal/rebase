import { Button } from "@/components/ui/button";
import Tiptap from "@/components/tiptap";

export default function Mailbox() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mailbox</h2>
        <div className="flex items-center space-x-2">
          <Button>New Message</Button>
        </div>
      </div>
      <Tiptap />
    </div>
  );
}
