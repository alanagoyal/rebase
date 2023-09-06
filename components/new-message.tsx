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

export default function NewMessage() {
  const supabase = createClientComponentClient();

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const {
          data: userData,
          error,
          status,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setName(userData?.full_name);
        setEmail(userData?.email);
        console.log(userData);
      } else {
        console.log("no user found");
      }
    };
    getUser();
  }, [supabase, setUser]);

  const [isTiptapOpen, setIsTiptapOpen] = React.useState(false);

  console.log(isTiptapOpen);

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
          userEmail={email}
          supabase={supabase}
          onSend={handleSend}
        />
      </Dialog>
    </div>
  );
}
