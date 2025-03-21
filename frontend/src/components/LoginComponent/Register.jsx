"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const passwordRequirements = [
  "Password must contain:",
  "• Minimum eight characters",
  "• At least one letter",
  "• At least one number",
  "• At least one special character (@,/,$,%,*,#,?,&)",
].join("\n");
const formSchema = z.object({
  fullName: z.string().min(1),
  email: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
      message: passwordRequirements,
    }),
  currentStd: z.string(),
  phoneNumber: z.string().min(10).max(13),
  parentsPhoneNumber: z.string().min(10).max(13),
  address: z.string(),
});

export default function Register() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      currentStd: "",
      parentsPhoneNumber: "",
      address: "",
    },
  });

  function onSubmit(values) {
    try {
      console.log(values);
      toast.success("Registration successful");
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto rounded-lg border bg-white"
      >
        <Card className={`md:px-28 px-5`}>
          <CardHeader className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Join Us Today!
            </h1>
          </CardHeader>
          <CardDescription className="text-gray-700 text-center text-lg">
            Start your journey with us—just fill in the details below to create
            your account.
          </CardDescription>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" type="text" {...field} />
                </FormControl>
                <FormDescription>Enter your full name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormDescription>Enter your email</FormDescription>
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
                  <PasswordInput placeholder="Password" {...field} />
                </FormControl>
                <FormDescription>Enter your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentStd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CurrentStd</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Current STD." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Class 5">Class 5</SelectItem>
                    <SelectItem value="Class 6">Class 6</SelectItem>
                    <SelectItem value="Class 7">Class 7</SelectItem>
                    <SelectItem value="Class 8">Class 8</SelectItem>
                    <SelectItem value="Class 9">Class 9</SelectItem>
                    <SelectItem value="Class 10">Class 10</SelectItem>
                    <SelectItem value="Class 11 Commerce">
                      Class 11 Commerce
                    </SelectItem>
                    <SelectItem value="Class 11 Science">
                      Class 11 Science
                    </SelectItem>
                    <SelectItem value="Class 12 Commerce">
                      Class 12 Commerce
                    </SelectItem>
                    <SelectItem value="Class 12 Science">
                      Class 12 Science
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the std. you are in</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Contact number</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    placeholder="Phone number"
                    {...field}
                    defaultCountry="IN"
                  />
                </FormControl>
                <FormDescription>Enter your phone number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentsPhoneNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Parent's contact</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    placeholder="Parent's phone number"
                    {...field}
                    defaultCountry="IN"
                  />
                </FormControl>
                <FormDescription>
                  Enter your parent's phone number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Address"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter your current address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            Register <ToastContainer position={`top-center`} />{" "}
          </Button>
        </Card>
      </form>
    </Form>
  );
}
