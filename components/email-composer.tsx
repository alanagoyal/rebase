import { useState } from "react";
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

import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

export default function EmaiLComposer({
  supabase,
  userEmail,
}: {
  supabase: SupabaseClient;
  userEmail: string;
}) {
  const emailFormSchema = z.object({
    to_emails: z.string().refine(
      (value) => {
        const emails = value.split(",").map((email) => email.trim());
        return emails.every(
          (email) => z.string().email().safeParse(email).success
        );
      },
      {
        message: "Please enter valid email addresses separated by commas.",
      }
    ),
    subject: z.string().optional(),
    body: z.string().optional(),
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
      to_emails: "",
      subject: "",
      body: "",
      cc: [],
      bcc: [],
      attachments: [],
    },
  });

  async function onSubmit(data: EmailFormValues) {
    console.log("submitting", data);

    try {
      const newEmailData = {
        to_emails: [data.to_emails],
        subject: data.subject,
        body: data.body,
        cc_emails: [],
        bcc_emails: [],
        attachments: [],
        from_email: userEmail,
      };

      const { data: newEmail, error } = await supabase
        .from("emails")
        .insert(newEmailData);

      if (error) {
        throw error;
      }

      console.log("New email inserted:", newEmail);
    } catch (error) {
      console.error("Error inserting email:", error);
    }
  }

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
                    <FormControl>
                      <Input {...field} />
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
                  onClick={() => {
                    console.log("clicked send");
                    // setIsTiptapOpen(false);
                  }}
                  className="bg-[#9FACE6] text-white font-bold py-2 px-4 rounded w-full"
                >
                  Send
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* <DialogDescription>
        Please enter the first name, last name, and email
      </DialogDescription> */}
      </DialogHeader>
    </DialogContent>
  );
}
