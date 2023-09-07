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
  user,
  supabase,
  userEmail,
  onSend,
}: {
  user: any;
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
          .select("id, first_name, last_name, email")
          .eq("created_by", user.id);
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

  const [selectedMembers, setSelectedMembers] = useState<OptionType[]>([]);
  const [allMemberGroups, setAllMemberGroups] = useState<OptionType[]>([]);

  const [memberEmailsArray, setMemberEmailsArray] = useState([]);

  useEffect(() => {
    async function fetchMemberGroups() {
      const { data: member_groups, error } = await supabase
        .from("member_groups")
        .select()
        .eq("created_by", user.id);

      // Transform the memebrGroup data for the selected component
      const options = member_groups.map((member_group) => ({
        value: member_group.id,
        label: member_group.name,
      }));

      if (error) {
        console.error("Error fetching member groups:", error);
      } else {
        setAllMemberGroups(options);
      }
    }
    if (user) {
      fetchMemberGroups();
    }
  }, [supabase, user]);

  async function fetchMemberGroupEmails(group_ids) {
    // Extract group_ids from the fetched member_groups
    const groupIds = allMemberGroups
      .map((allMemberGroup) => allMemberGroup.value)
      .filter((id) => group_ids.includes(id));

    // Fetch member_group_joins records with these group_ids
    const { data: memberGroupJoins, error: joinError } = await supabase
      .from("member_group_joins")
      .select("member_id")
      .in("group_id", groupIds);

    const memberGroupArray = Object.values(memberGroupJoins);
    const memberIds = memberGroupArray.map((join) => join.member_id);

    // Fetch member emails from the members table based on the extracted member_ids
    const { data: memberEmails, error: memberEmailError } = await supabase
      .from("members")
      .select("email")
      .in("id", memberIds);
    const array = memberEmails.map((join) => join.email);
    setMemberEmailsArray(array);
    // const memberEmailsArray = Object.values(memberEmails);
    return array;
  }

  interface OptionType {
    value: any;
    label: string;
  }

  const { register, handleSubmit, reset } = useForm();
  const [isSending, setIsSending] = useState(false);
  const emailFormSchema = z.object({
    to_emails: z
      .array(
        z.object({
          value: z.union([z.string(), z.number()]),
          label: z.string(),
        })
      )
      .refine(
        (value) => {
          const emails = value.map((item) => item.value.toString().trim());
          const areAllEmailsValid = emails.every((email) => {
            ``;
            const isValid =
              !isNaN(parseInt(email)) ||
              z.string().email().safeParse(email).success;
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

  const onSubmit = async (data: EmailFormValues) => {
    // check that domain is verified
    console.log(userEmail);
    // check that userEmail contains @basecase.vc
    if (!userEmail.includes("@basecase.vc")) {
      toast({
        description: (
          <span>
            Please head to <a href="https://www.resend.com">Resend</a> to verify
            your domain and start sending emails.
          </span>
        ),
      });
      setIsSending(false);
      return;
    }

    try {
      setIsSending(true);

      const toEmails = data.to_emails.map((email) => email.value);
      let mergedEmails = toEmails;
      const memberEmails = await fetchMemberGroupEmails(
        toEmails.filter((em) => !isNaN(em))
      );
      // if (memberEmails.length > 0) {
      mergedEmails = [...new Set([...toEmails, ...memberEmails])].filter((v) =>
        isNaN(v)
      );
      // }
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
        onSend();
        form.reset();
        toast({
          description: "Your email has been sent successfully",
        });
      } else {
        console.error("Failed to send email", response.statusText);
        toast({
          description: response.statusText,
        });
      }
    } catch (error) {
      toast({
        description: "An error occurred while sending the email",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Compose Email</DialogTitle>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        options={[...selectedMembers, ...allMemberGroups]}
                      />
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
