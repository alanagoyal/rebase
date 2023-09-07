"use client"; // This is a client component 👈🏽

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
  createClientComponentClient,
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import * as z from "zod";
import EmailComposer from "@/components/email-composer";

export default async function Mailbox() {
  const supabase = createClientComponentClient();

  const [name, setName] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [isTiptapOpen, setIsTiptapOpen] = React.useState(false);

  const handleNewMessageClick = () => {
    setIsTiptapOpen(true);
  };

  const handleSend = () => {
    setIsTiptapOpen(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mailbox</h2>
        <div className="flex items-center space-x-2"></div>
      </div>
      <Dialog open={isTiptapOpen} onOpenChange={setIsTiptapOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleNewMessageClick}>New Message</Button>
        </DialogTrigger>

        <EmailComposer
          user={user}
          userEmail={email}
          supabase={supabase}
          onSend={handleSend}
        />
      </Dialog>
    </div>
  );
}
