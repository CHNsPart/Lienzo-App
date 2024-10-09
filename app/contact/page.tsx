'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import OfficeDetails from '@/components/contact/OfficeDetails';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactPage: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(data);
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    });
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-400">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>{"We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible."}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  disabled
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Your Name"
                />
                {errors.name && <p className="text-[#F26B60] text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  disabled
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-[#F26B60] text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  disabled
                  id="subject"
                  {...register("subject", { required: "Subject is required" })}
                  placeholder="What's this about?"
                />
                {errors.subject && <p className="text-[#F26B60] text-sm mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  disabled
                  id="message"
                  {...register("message", { required: "Message is required" })}
                  placeholder="Your message here..."
                  rows={4}
                />
                {errors.message && <p className="text-[#F26B60] text-sm mt-1">{errors.message.message}</p>}
              </div>
              {/* <Button type="submit" className="w-full bg-[#F26B60] hover:bg-[#F26B60]/90" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button> */}
              <Button type="submit" className="w-full bg-[#F26B60] hover:bg-[#F26B60]/90" disabled>
                {'We are working on it.'}
              </Button>
            </form>
          </CardContent>
        </Card>


        <div className="space-y-6">
          <OfficeDetails/>
        </div>



      </div>
    </div>
  );
};

export default ContactPage;