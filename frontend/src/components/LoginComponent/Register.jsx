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
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-lg overflow-hidden w-full">
        {/* Left Side - Image */}
        <div className="hidden md:flex items-center justify-center">
          <img
            src="/images/KCC%20CLASSES.png"
            alt="Join us"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="p-8">
          <Card className="w-full">
            <CardHeader className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-900">
                Join Us Today!
              </h1>
            </CardHeader>
            <CardDescription className="text-gray-700 text-center">
              Fill in the details to create your account.
            </CardDescription>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-8"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
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
                        <PasswordInput placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentStd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Class</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "Class 5",
                            "Class 6",
                            "Class 7",
                            "Class 8",
                            "Class 9",
                            "Class 10",
                            "Class 11 Commerce",
                            "Class 11 Science",
                            "Class 12 Commerce",
                            "Class 12 Science",
                          ].map((className) => (
                            <SelectItem key={className} value={className}>
                              {className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="Phone number"
                          {...field}
                          defaultCountry="IN"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentsPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent's Contact</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="Parent's phone number"
                          {...field}
                          defaultCountry="IN"
                        />
                      </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Register
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
