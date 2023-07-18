"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { MembersTable } from "./members-table";
import { useRouter } from "next/navigation";

const memberFormSchema = z.object({
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

export default function MemberForm({
  user,
  members,
}: {
  user: any;
  members: any;
}) {
  const [open, setOpen] = React.useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  async function onSubmit(data: MemberFormValues) {
    try {
      const updates = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        created_by: user?.id,
      };

      let { error } = await supabase.from("members").insert(updates);
      if (error) throw error;
      toast({
        description: "Your member has been added",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Members</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Member</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Member</DialogTitle>
                <DialogDescription>
                  Please enter the first name, last name, and email
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {" "}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base mx-2">
                              Email
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base mx-2">
                              First Name
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base mx-2">
                              Last Name
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="py-1 flex justify-center">
                      <Button
                        type="submit"
                        onClick={() => {
                          setOpen(false);
                        }}
                        className="bg-[#9FACE6] text-white font-bold py-2 px-4 rounded w-full"
                      >
                        Add
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex">
        <MembersTable members={members} />
      </div>
    </div>
  );
}
