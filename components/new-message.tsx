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
import { Mail } from "lucide-react";

export default function NewMessage({ user }: { user: any }) {
  const supabase = createClientComponentClient();
  const [isTiptapOpen, setIsTiptapOpen] = React.useState(false);

  const handleNewMessageClick = () => {
    setIsTiptapOpen(true);
  };

  const handleSend = () => {
    setIsTiptapOpen(false);
  };

  return (
    <div>
      <Dialog open={isTiptapOpen} onOpenChange={setIsTiptapOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleNewMessageClick}>
            {" "}
            <Mail className="w-6 h-6 p-1" />
            New Message
          </Button>
        </DialogTrigger>

        <EmailComposer
          user={user}
          userEmail={user.email}
          supabase={supabase}
          onSend={handleSend}
        />
      </Dialog>
    </div>
  );
}
