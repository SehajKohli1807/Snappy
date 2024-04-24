"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import AuthSocialButton from "./authSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Credentials from "next-auth/providers/credentials";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type variant = "LOGIN" | "REGISTER";

export default function AuthForm() {
  const session = useSession();
  const [variant, setVariant] = useState<variant>("REGISTER");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    console.log(values);

    if (variant === "REGISTER") {
      try {
        const response = await axios
          .post("/api/register", {
            name: values.username,
            email: values.email,
            password: values.password,
          })
          .then(() => signIn("credentials", values))
          .catch(() => toast.error("Something Went Wrong !"))
          .finally(() => setLoading(false));
        console.log("Successful");
      } catch (error) {
        console.log(error);
      }
    }
    if (variant === "LOGIN") {
      //choose provider for signIn from "app/api/auth/[...nextauth]/route.ts"
      signIn("credentials", { ...values, redirect: false })
        .then((callbck) => {
          if (callbck?.error) {
            toast.error("Invalid Credentials");
          }
          if (callbck?.ok && !callbck?.error) {
            toast.success("Logged In!");
            router.push("/users");
          }
        })
        .finally(() => setLoading(false));
    }
  }

  function socialAction(action: string): void {
    signIn(action, { redirect: false })
      .then((callbck) => {
        if (callbck?.error) {
          toast.error("Invalid Credentials");
        }
        if (callbck?.ok) {
          toast.success("Logged In!");
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Form {...form}>
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="block m-auto w-full bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
              type="submit"
            >
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <AuthSocialButton
                icon={BsGithub}
                onClick={() => socialAction("github")}
              />
              <AuthSocialButton
                icon={BsGoogle}
                onClick={() => socialAction("google")}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
            <div>
              {variant === "LOGIN"
                ? "New to messenger ?"
                : "Already have an account ?"}
            </div>
            <div onClick={toggleVariant} className="underline cursor-pointer">
              {variant === "LOGIN" ? "Create an account" : "Login"}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
