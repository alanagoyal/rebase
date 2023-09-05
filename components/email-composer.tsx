import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/tiptap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cookies } from "next/headers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  SupabaseClient,
  createClientComponentClient,
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { toast } from "@/components/ui/use-toast";

import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

export default function EmailComposer({
  supabase,
  userEmail,
  onSend,
}: {
  supabase: SupabaseClient;
  userEmail: string;
  onSend: () => void;
}) {
  useEffect(() => {
    // Fetch members from your Supabase database
    async function fetchMembers() {
      try {
        const { data: members, error } = await supabase
          .from("members")
          .select("id, first_name, last_name, email");
        if (error) {
          console.error("Error fetching members:", error);
          return;
        }

        // Transform the member data into options for Select component
        const options = members.map((member) => ({
          value: member.email,
          label: `${member.first_name} ${member.last_name} - ${member.email}`,
        }));

        setSelectedMembers(options);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    }

    fetchMembers();
  }, []); // Run this effect only once on component mount

  // interface MemberGroup {
  //   id: number;
  //   label: string;
  // }

  const [selectedMembers, setSelectedMembers] = useState<OptionType[]>([]);
  const [selectedMemberGroups, setSelectedMemberGroups] = useState<
    OptionType[]
  >([]);

  const [memberEmailsArray, setMemberEmailsArray] = useState([]);

  useEffect(() => {
    async function fetchMemberGroups() {
      const { data: member_groups, error } = await supabase
        .from("member_groups")
        .select();

      // Transform the memebrGroup data for the selected component
      const options = member_groups.map((member_group) => ({
        value: member_group.id,
        label: member_group.name,
      }));

      if (error) {
        console.error("Error fetching member groups:", error);
      } else {
        console.log("member groups", options);
        setSelectedMemberGroups(options);
      }
    }
    fetchMemberGroups();
  }, [supabase]);

  //Fetch member ids for the selected groups
  useEffect(() => {
    async function fetchMemberGroupEmails() {
      // Extract group_ids from the fetched member_groups
      const groupIds = selectedMemberGroups.map(
        (selectedMemberGroup) => selectedMemberGroup.value
      );

      // Fetch member_group_joins records with these group_ids
      const { data: memberGroupJoins, error: joinError } = await supabase
        .from("member_group_joins")
        .select("member_id")
        .in("group_id", groupIds);

      console.log("memebrGroupJoins", memberGroupJoins);
      const memberGroupArray = Object.values(memberGroupJoins);
      const memberIds = memberGroupArray.map((join) => join.member_id);
      console.log("memberIds", memberIds);

      // Fetch member emails from the members table based on the extracted member_ids
      const { data: memberEmails, error: memberEmailError } = await supabase
        .from("members")
        .select("email")
        .in("id", memberIds);
      console.log("memberEmails", memberEmails);
      const array = memberEmails.map((join) => join.email);
      setMemberEmailsArray(array);
      // const memberEmailsArray = Object.values(memberEmails);
      console.log("ARRAY", memberEmailsArray);
    }
    if (selectedMemberGroups.length > 0) {
      fetchMemberGroupEmails();
    }
  }, [selectedMemberGroups]);

  interface OptionType {
    value: any;
    label: string;
  }

  const { register, handleSubmit, reset } = useForm();
  const [isSending, setIsSending] = useState(false);
  const emailFormSchema = z.object({
    to_emails: z
      .array(
        z.union([
          z.object({
            value: z.string(),
            label: z.string(),
          }),
          z.number(),
        ])
      )
      .refine(
        (value) => {
          const emails = value.map((item) => item.value.trim());
          const areAllEmailsValid = emails.every((email) => {
            ``;
            const isValid = z.string().email().safeParse(email).success;
            console.log(`Is email "${email}" valid?`, isValid); // Log the validation result for each email
            return isValid;
          });
          return areAllEmailsValid;
        },
        {
          message: "Please enter valid email addresses.",
        }
      ),
    subject: z.string(),
    body: z.string(),
    cc: z
      .array(
        z.string().email({ message: "Please enter a valid email address." })
      )
      .optional(),
    bcc: z
      .array(
        z.string().email({ message: "Please enter a valid email address." })
      )
      .optional(),
    attachments: z.array(z.string()).optional(),
    group_emails: z
      .array(
        z.object({
          value: z.number(),
          label: z.string(),
        })
      )
      .optional(),
  });

  console.log("GRP", selectedMemberGroups);
  type EmailFormValues = z.infer<typeof emailFormSchema>;

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      to_emails: [],
      subject: "",
      body: "",
      cc: [],
      bcc: [],
      attachments: [],
    },
  });

  selectedMembers.map((email) => console.log("SLCTEDMEMBER", email));

  // console.log("SLECTEDMEMBER", selectedMembers);

  const onSubmit = async (data: EmailFormValues) => {
    try {
      setIsSending(true);

      const toEmails = data.to_emails.map((email) => email.value);
      let mergedEmails = toEmails;

      if (memberEmailsArray.length > 0) {
        mergedEmails = [...new Set([...toEmails, ...memberEmailsArray])];
      }
      console.log("MERGE", mergedEmails);
      const newEmailData = {
        to_emails: mergedEmails,
        subject: data.subject ? data.subject : "empty subject",
        body: data.body ? data.body : "<p></p>",
        cc_emails: [],
        bcc_emails: [],
        attachments: [],
        from_email: userEmail,
      };

      const response = await fetch("/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmailData),
      });

      const { data: newEmail, error: insertError } = await supabase
        .from("emails")
        .insert([newEmailData]);

      if (response.ok) {
        console.log("Email sent successfully");
        onSend();
        form.reset();
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsSending(false);
    }
    toast({
      description: "Your email has been sent successfully",
    });
  };

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Compose Email</DialogTitle>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {" "}
              <FormField
                control={form.control}
                name="to_emails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base mx-2">To</FormLabel>
                    </div>
                    <FormControl className="w-full">
                      <Select
                        {...field}
                        isMulti
                        options={[...selectedMembers, ...selectedMemberGroups]}
                      />
                      {/* <Input {...field} /> */}
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* TODO: putting in separate field for now, will combine later */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base mx-2">Subject</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="body"
                control={form.control}
                render={({ field }) => (
                  <>
                    <Tiptap field={field} setValue={form.setValue} />
                  </>
                )}
              />
              <div className="py-1 flex justify-center">
                <Button
                  type="submit"
                  className="bg-[#9FACE6] text-white font-bold py-2 px-4 rounded w-full"
                >
                  Send
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}
