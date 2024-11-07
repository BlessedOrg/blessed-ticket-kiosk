"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PayWithCoinbaseButton } from "@/components/coinbase-onramp";

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
});

const otpSchema = z.object({
  otp: z.string().length(5, { message: "OTP must be 5 digits" }).regex(/^\d+$/, { message: "OTP must contain only numbers" })
});

export function EmailLoginForm() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1);
  const [userSmartWalletAddress, setUserSmartWalletAddress] = useState();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    }
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ""
    }
  });

  const handleEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/developers/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: values.email })
      });
      const data = await res.json();
      if (data) {
        setStep(2);
      }
    } catch (err: any) {
      console.log("🚨 error ", err.message);
    }
  };

  const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/developers/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: values.otp })
      });
      const data = await res.json();
      if (data) {
        setIsAuthenticated(true);
        setUserSmartWalletAddress(data?.developer?.smartWalletAddress);
        console.log("🔮 data: ", data);
      }
    } catch (err: any) {
      console.log("🚨 error ", err.message);
    }
  };

  return (
    !isAuthenticated ? (
      <div className="flex items-center justify-center w-full h-full min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login and fund your Wallet</CardTitle>
            <CardDescription>
              {step === 1 ? "Enter your email to receive an OTP." : "Enter the 5-digit OTP sent to your email."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={emailForm.formState.isSubmitting}>
                    {emailForm.formState.isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              </Form>
            ) : null}
            {step === 2 ? (
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter 5-digit OTP" {...field} maxLength={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="submit" disabled={otpForm.formState.isSubmitting}>
                      {otpForm.formState.isSubmitting ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : null}
          </CardContent>
        </Card>
      </div>
    ) : (
      <div className="flex items-center justify-center w-full h-full min-h-screen bg-gray-100">
        <Card className="">
          <CardHeader>
            <CardTitle>Fund Wallet with crypto</CardTitle>
            <CardDescription>
              Your wallet address: {userSmartWalletAddress}
            </CardDescription>
          </CardHeader>
          <CardContent>
             <PayWithCoinbaseButton disabled={!userSmartWalletAddress} smartWalletAddress={userSmartWalletAddress} />
          </CardContent>
        </Card>
      </div>
    )
  );
}