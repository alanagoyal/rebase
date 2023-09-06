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
import { Edit } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { useEffect } from "react";
import { MultiValue } from "react-select";

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

interface MemberGroup {
  id: number;
  name: string;
}

export default function EditMemberForm({
  member,
  existingGroups,
}: {
  member: any;
  existingGroups: any;
}) {
  //track all the groups
  const [memberGroups, setMemberGroups] = React.useState<MemberGroup[]>([]);

  const [open, setOpen] = React.useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      email: member.email || "",
      first_name: member.first_name || "",
      last_name: member.last_name || "",
    },
  });

  // TODO: Can probably remove this later and do the fetching once
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

  const [selectedGroups, setSelectedGroups] =
    React.useState<MultiValue<number> | null>(null); // State to track selected group

  React.useEffect(() => {
    // Format existingGroups into an array of objects with label and value properties
    const formattedGroups = existingGroups
      ? existingGroups.split(",").map((groupName) => ({
          label: groupName,
          value: groupName,
        }))
      : null;

    // Check if any of the group names is "none"
    if (
      formattedGroups &&
      formattedGroups.some((group) => group.value === "None")
    ) {
      setSelectedGroups(null); // Set selectedGroups to null
    } else {
      setSelectedGroups(formattedGroups);
    }
  }, [existingGroups]);

  console.log("Select", selectedGroups);
  console.log("EIT", existingGroups);
  const existingGroupIds = existingGroups ? existingGroups.split(",") : [];

  console.log("existingIDs", existingGroupIds);
  async function onSubmit(data: MemberFormValues) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let groupIds = [];

    // Delete all existing associations for the member
    const { error: deleteError } = await supabase
    .from("member_group_joins")
    .delete()
    .eq("member_id", member.id);
    if (deleteError) {
    console.error("Error deleting existing associations:", deleteError);
    }

    // Get the IDs of the selected groups that already exist in memberGroups
    // Get the IDs of the selected groups that already exist in memberGroups
    const existingGroupIds = selectedGroups
      ?.filter((group) =>
        memberGroups?.map(({ name }) => name).includes(group.value)
      )
      .map((group) => memberGroups.find(({ name }) => name === group.value)?.id);

    // Add the IDs of the existing groups to groupIds
   
    // Save new groups - if the member group doesn't hold any of the selected groups
    const newGroups =
      selectedGroups
        ?.filter(
          (group) =>
            !memberGroups?.map(({ name }) => name).includes(group.value)
        )
        .map(({ value }) => value) || [];

    //Creating a new group if there are elements in the newgroup array
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

    try {
      const updates = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        created_by: user?.id,
      };

      const selectedGroupIds = selectedGroups
        ? selectedGroups.map((group) => group.value)
        : [];

      console.log("SId", selectedGroupIds);

      if (!!selectedGroups?.length && member.id) {
       // Insert new associations
        const joinUpdates = selectedGroups
        ?.map((group) => memberGroups.find((g) => g.name === group.value)?.id)
        .concat(groupIds)
        .filter((id) => id !== undefined)
        .map((memberGroupId) => ({
          member_id: member.id,
          group_id: memberGroupId,
        }));

        const { error: joinError } = await supabase
          .from("member_group_joins")
          .insert(joinUpdates);
        if (joinError) {
          console.error("Error updating member_group_joins:", joinError);
        }
      }
      let { error } = await supabase
        .from("members")
        .update(updates)
        .eq("id", member.id);
      if (error) throw error;
      toast({
        description: "Your member has been updated",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  // React.useEffect(() => {
  //   async function fetchMemberGroups() {
  //     const { data, error } = await supabase.from("member_groups").select();
  //     if (error) {
  //       console.error("Error fetching member groups:", error);
  //     } else {
  //       console.log("member groups", data);
  //       setMemberGroups(data);
  //     }
  //   }
  //   fetchMemberGroups();
  // }, [supabase]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Edit className="h-4 w-4 ml-4 text-muted-foreground" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
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
                            label: group.name,
                            value: group.name,
                          }))}
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
                    Save
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
