"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import StripeCheckoutButton from "@/components/stripe-checkout";
import { login, verify } from "@/actions";
import CardWrapper from "@/components/card-wrapper";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
});

const otpSchema = z.object({
  otp: z.string().length(5, { message: "OTP must be 5 digits" }).regex(/^\d+$/, { message: "OTP must contain only numbers" })
});

export function EmailLoginForm({ ticketDetails }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState();

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
      const data = await login(values.email);
      console.log("💽 data: ", data)
      if (data) {
        setStep(2);
      }
    } catch (err: any) {
      console.log("🚨 error ", err.message);
    }
  };

  const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    try {
      const data = await verify(values.otp);
      if (data) {
        setIsAuthenticated(true);
        setUserId(data.user.id);
        console.log("🔮 data: ", data);
      }
    } catch (err: any) {
      console.log("🚨 error ", err.message);
    }
  };

  const title = `Buy a ticket for ${ticketDetails.eventName}`;
  const description = isAuthenticated
    ? "After clicking button bellow you will be redirected to the payment provider."
    : step === 1 ? "Enter your email to receive an OTP." : "Enter the 5-digit OTP sent to your email.";


  return (
    <CardWrapper title={title} description={description}>
      {!isAuthenticated ? (
        <>
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
                      {/*<FormLabel className="text-center block">OTP</FormLabel>*/}
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP maxLength={5} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot className="w-10 h-10" index={0} />
                              <InputOTPSlot className="w-10 h-10" index={1} />
                              <InputOTPSlot className="w-10 h-10" index={2} />
                              <InputOTPSlot className="w-10 h-10" index={3} />
                              <InputOTPSlot className="w-10 h-10" index={4} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
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
        </>
      ) : (
        <StripeCheckoutButton  userId={userId!} ticketId={ticketDetails.ticketId} />
      )}
    </CardWrapper>
  );
}