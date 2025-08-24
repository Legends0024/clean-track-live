import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SupportForm } from '@/components/forms/SupportForm';
import { useSocket } from '@/hooks/useSocket';

const faqData = [
  {
    question: 'How do I report a cleanliness issue?',
    answer: 'To report a cleanliness issue, navigate to your dashboard and click on the "Report Issue" button. Fill in the required details including location, type of issue, and any relevant photos.',
  },
  {
    question: 'What are the SLA timelines for task completion?',
    answer: 'Standard tasks should be completed within 2 hours of assignment. High-priority tasks must be addressed within 30 minutes. Emergency situations require immediate attention.',
  },
  {
    question: 'How do I update my task status?',
    answer: 'Open the task from your dashboard, click on "Update Status", and select the appropriate status. Add any necessary comments or photos to document the work completed.',
  },
  {
    question: 'Can I change my notification preferences?',
    answer: 'Yes, you can customize your notification preferences in the Settings page. You can enable/disable different types of alerts and choose your preferred notification method.',
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your inbox. For security reasons, password reset links expire after 24 hours.',
  },
];

const HelpPage: React.FC = () => {
  const { connected } = useSocket();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container max-w-4xl py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Find answers or get in touch with our support team</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Contact Support</h2>
            </div>

            <SupportForm />
          </Card>

          {connected && (
            <Card className="p-6 bg-muted">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Live Chat Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is available to help you in real-time
                </p>
                <Button variant="secondary" className="w-full">
                  Start Chat
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HelpPage;
