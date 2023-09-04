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

  const [selectedMembers, setSelectedMembers] = useState<OptionType[]>([]);

  // ...

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
          value: z.string(),
          label: z.string(),
        })
      )
      .refine(
        (value) => {
          const emails = value.map((item) => item.value.trim());
          const areAllEmailsValid = emails.every((email) => {
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
    try {
      setIsSending(true);
      const newEmailData = {
        to_emails: data.to_emails.map((email) => email.value),
        subject: data.subject,
        body: data.body,
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
        reset();
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
                      <CreatableSelect
                        {...field}
                        isMulti
                        options={selectedMembers}
                      />
                      {/* <Input {...field} /> */}
                    </FormControl>
                  </FormItem>
                )}
              />
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
