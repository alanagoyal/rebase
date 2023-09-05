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
import { useRouter } from "next/navigation";
import CreatableSelect from "react-select/creatable";
import { MultiValue } from "react-select";
import { User } from "lucide-react";

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

export default function AddMemberForm({ user }: { user: any }) {
  const supabase = createClientComponentClient();
  const [memberGroups, setMemberGroups] = React.useState<MemberGroup[]>([]); // State to store member groups
  const [selectedGroups, setSelectedGroups] =
    React.useState<MultiValue<number> | null>(null); // State to track selected group
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  React.useEffect(() => {
    async function fetchMemberGroups() {
      const { data, error } = await supabase.from("member_groups").select();
      if (error) {
        console.error("Error fetching member groups:", error);
      } else {
        console.log("member groups", data);
        setMemberGroups(data);
      }
    }
    fetchMemberGroups();
  }, [supabase]);

  interface MemberGroup {
    id: number;
    name: string;
  }

  async function onSubmit(data: MemberFormValues) {
    try {
      // Get the IDs of the selected groups that already exist in memberGroups
      const existingGroupIds = selectedGroups
        ?.filter((group) =>
          memberGroups?.map(({ name }) => name).includes(group.value)
        )
        .map(
          (group) => memberGroups.find(({ name }) => name === group.value)?.id
        );

      // let groupIds = [];
      // groupIds = groupIds.concat(existingGroupIds);

      // Add the IDs of the existing groups to groupIds
      console.log("memberGroups", memberGroups);
      // Check if the selectedGroups exists in memberGroups
      const newGroups =
        selectedGroups
          ?.filter(
            (group) =>
              !memberGroups?.map(({ name }) => name).includes(group.value)
          )
          .map(({ value }) => value) || [];

      console.log("newgroups", newGroups);

      // groupIds = selectedGroups?.map((group) => group.value);

      // If selectedGroups doesn't exist, create a new group
      let groupIds = [];
      if (!!newGroups.length) {
        const groupResponse = await supabase
          .from("member_groups")
          .insert(newGroups.map((name) => ({ name })))
          .select();
        console.log("gr", groupResponse);
        const { data: createdGroups, error: createGroupError } = groupResponse;
        console.log("created groups", createdGroups);
        if (createGroupError) {
          console.error("Error creating new group:", createGroupError);
        } else {
          if (Array.isArray(createdGroups) && createdGroups.length > 0) {
            groupIds = createdGroups.map(({ id }) => id);
          }
        }
      }

      // Create the new member
      const memberUpdates = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        created_by: user?.id,
      };

      // Insert the new member and get the member_id
      const { data: newMember, error: memberError } = await supabase
        .from("members")
        .insert([memberUpdates])
        .select();
      if (memberError) {
        throw memberError;
      }
      const memberID = newMember[0].id;

      console.log("SELECT", selectedGroups);

      // Update the joins table to associate the member with the group
      if (!!selectedGroups?.length && memberID) {
        const joinUpdates = memberGroups
          ?.filter((memberGroup) =>
            selectedGroups
              .map((selectedGroup) => selectedGroup.value)
              .includes(memberGroup.name)
          )
          .map(({ id }) => id)
          .concat(groupIds)
          .map((memberGroupId) => ({
            member_id: memberID,
            group_id: memberGroupId,
          }));

        const { error: joinError } = await supabase
          .from("member_group_joins")
          .insert(joinUpdates);
        if (joinError) {
          console.error("Error updating member_group_joins:", joinError);
        }
      }
      form.reset();
      setSelectedGroups(null);

      toast({
        description: "Your member has been added",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            {" "}
            <User className="w-6 h-6 p-1" />
            New Member
          </Button>
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
                        <FormLabel className="text-base mx-2">Email</FormLabel>
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
                <FormField
                  control={form.control}
                  name="group_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base mx-2">Group</FormLabel>
                      </div>
                      <FormControl>
                        <CreatableSelect
                          {...field}
                          isMulti
                          options={memberGroups.map((group) => ({
                            //badly typed pkg, ignore squiggly
                            label: group.name,
                            value: group.name,
                          }))} // Convert memberGroups to options
                          value={selectedGroups}
                          onChange={(value) => {
                            console.log("creatable value", value);
                            setSelectedGroups(value);
                          }}
                        />
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
  );
}
