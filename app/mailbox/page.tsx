"use client"; // This is a client component 👈🏽

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
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import { Controller, useForm } from "react-hook-form";

import * as z from "zod";

export default function Mailbox() {
  const [isTiptapOpen, setIsTiptapOpen] = useState(false);

  console.log(isTiptapOpen);

  const handleNewMessageClick = () => {
    setIsTiptapOpen(true);
  };

  const emailFormSchema = z.object({
    // to: z
    //   .array(
    //     z.string().email({ message: "Please enter a valid email address." })
    //   )
    //   .min(1, "Please enter at least one recipient."),
    // to: z
    //   .string()
    //   .email({ message: "YAM YAM YAM gimme valid email at least mister." }),
    to: z.string().refine(
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
      to: "",
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
      const updates = {
        to: [data.to],
        subject: "",
        body: data.body,
        cc: [],
        bcc: [],
        attachments: [],
      };
      console.log("check whether u need to update hardocded  values");
      console.log(updates);

      //   let { error } = await supabase.from("members").insert(updates);
      //   if (error) throw error;
      //   toast({
      //     description: "Your member has been added",
      //   });
      //   router.refresh();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mailbox</h2>
        <div className="flex items-center space-x-2"></div>
      </div>
      <Dialog open={isTiptapOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleNewMessageClick}>New Message</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
            <div className="grid gap-4 py-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {" "}
                  <FormField
                    control={form.control}
                    name="to"
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
                          <FormLabel className="text-base mx-2">
                            Subject
                          </FormLabel>
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
      </Dialog>
    </div>
  );
}
