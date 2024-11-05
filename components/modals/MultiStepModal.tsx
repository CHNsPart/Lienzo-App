'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, ThumbsUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";

type FormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  companySize: string;
  interests: string[];
};

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  companyName: '',
  companySize: '',
  interests: [],
};

interface MultiStepModalProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}

export default function MultiStepModal({ isOpen, onClose }: MultiStepModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, companySize: value }));
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return !!formData.fullName;
      case 1:
        return !!formData.email;
      case 2:
        return !!formData.companySize;
      case 3:
        return formData.interests.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit quote request');

      setIsSubmitted(true);
      toast({
        title: "Quote Request Submitted",
        description: "We'll get back to you soon!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setIsSubmitted(false);
    setFormData(initialFormData);
    setCurrentStep(0);
    onClose(false);
  };

  const steps = [
    {
      title: 'Personal Info',
      fields: (
        <div className="space-y-4">
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            name="fullName" 
            placeholder="Enter your full name" 
            required 
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </div>
      ),
    },
    {
      title: 'Contact',
      fields: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="Enter your email" 
              required 
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              name="phoneNumber" 
              type="tel" 
              placeholder="Enter your phone number" 
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Company',
      fields: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name (Optional)</Label>
            <Input 
              id="companyName" 
              name="companyName" 
              placeholder="Enter your company name" 
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="companySize">Company Size</Label>
            <Select value={formData.companySize} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Only me</SelectItem>
                <SelectItem value="small">1-10 employees</SelectItem>
                <SelectItem value="medium">11-100 employees</SelectItem>
                <SelectItem value="large">101-500 employees</SelectItem>
                <SelectItem value="enterprise">500+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      title: 'Interests',
      fields: (
        <div className="space-y-4">
          {['License Management', 'Bulk Purchasing', 'Compliance Tracking', 'Asset Management'].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={option} 
                checked={formData.interests.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSubmitted ? "Thank You!" : steps[currentStep].title}</DialogTitle>
        </DialogHeader>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[#f26b60] to-[#e25b50] rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                {steps.map((_, index) => (
                  <span key={index} className={index <= currentStep ? 'text-[#f26b60]' : ''}>
                    Step {index + 1}
                  </span>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {steps[currentStep].fields}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  size="icon"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        ) : (
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
          >
            <ThumbsUp className="w-12 h-12 text-green-600" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-4">Quote Request Received!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for your interest. Our team will carefully review your request and get back to you with a personalized quote within 2 business days.
          </p>
          <p className="text-gray-600 mb-6">
            If you have any urgent questions, please don't hesitate to contact our support team.
          </p>
          <Button onClick={handleDone} className="w-full">
            Close
          </Button>
        </div>
      )}
      </DialogContent>
    </Dialog>
  )
}