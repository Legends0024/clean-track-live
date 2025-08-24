import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Book,
  Bookmark,
  Search,
  FileDown,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface DocSection {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  content: DocContent[];
}

interface DocContent {
  type: 'text' | 'list' | 'code' | 'note';
  content: string | string[];
}

const mockDocs: DocSection[] = [
  {
    id: '1',
    title: 'Getting Started',
    description: 'Essential information for new users',
    category: 'Basics',
    lastUpdated: '2025-08-20',
    content: [
      {
        type: 'text',
        content: 'Welcome to the NHAI Smart Toilet Management System. This guide will help you understand the basic features and functionalities of the system.',
      },
      {
        type: 'list',
        content: [
          'Dashboard Overview',
          'User Roles and Permissions',
          'Basic Navigation',
          'Common Tasks',
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'System Requirements',
    description: 'Technical requirements and specifications',
    category: 'Technical',
    lastUpdated: '2025-08-18',
    content: [
      {
        type: 'text',
        content: 'Ensure your system meets these requirements for optimal performance:',
      },
      {
        type: 'list',
        content: [
          'Modern web browser (Chrome, Firefox, Safari)',
          'Minimum 4GB RAM',
          'Stable internet connection',
          'GPS enabled device for mobile access',
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Maintenance Guidelines',
    description: 'Standard operating procedures for maintenance',
    category: 'Operations',
    lastUpdated: '2025-08-15',
    content: [
      {
        type: 'text',
        content: 'Follow these guidelines for routine maintenance:',
      },
      {
        type: 'note',
        content: 'Regular maintenance is crucial for optimal facility operation.',
      },
      {
        type: 'list',
        content: [
          'Daily cleaning schedule',
          'Weekly maintenance checks',
          'Monthly deep cleaning',
          'Quarterly system updates',
        ],
      },
    ],
  },
];

const categoryColors = {
  Basics: 'bg-blue-500/10 text-blue-500',
  Technical: 'bg-purple-500/10 text-purple-500',
  Operations: 'bg-green-500/10 text-green-500',
};

const DocsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredDocs = mockDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">System guides and technical documentation</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold mb-4">Quick Links</h2>
            <nav className="space-y-2">
              {['User Manual', 'API Reference', 'FAQs', 'Release Notes'].map((link) => (
                <Button
                  key={link}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  {link}
                </Button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              {filteredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b last:border-b-0 pb-4 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.description}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={categoryColors[doc.category as keyof typeof categoryColors]}
                    >
                      {doc.category}
                    </Badge>
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value={`doc-${doc.id}`}>
                      <AccordionTrigger>View Content</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {doc.content.map((section, index) => {
                            if (section.type === 'text') {
                              return (
                                <p key={index} className="text-sm">
                                  {section.content as string}
                                </p>
                              );
                            } else if (section.type === 'list') {
                              return (
                                <ul key={index} className="list-disc pl-4 space-y-1">
                                  {(section.content as string[]).map((item, i) => (
                                    <li key={i} className="text-sm">
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              );
                            } else if (section.type === 'note') {
                              return (
                                <div
                                  key={index}
                                  className="bg-blue-500/10 text-blue-500 p-3 rounded-md text-sm"
                                >
                                  {section.content as string}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" className="text-xs">
                      <FileDown className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Full
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default DocsPage;
