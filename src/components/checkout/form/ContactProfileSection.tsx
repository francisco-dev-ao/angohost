import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User } from 'lucide-react';

interface ContactProfile {
  id: string;
  name: string;
  document: string;
}

interface ContactProfileSectionProps {
  profiles: ContactProfile[];
  isLoadingProfiles: boolean;
  selectedContactProfile: string | null;
  setSelectedContactProfile: (id: string) => void;
  hasDomains: boolean;
}

// This component is now disabled as per user request, but we keep it
// in the codebase in case it needs to be re-enabled in the future
const ContactProfileSection = ({ 
  profiles, 
  isLoadingProfiles, 
  selectedContactProfile, 
  setSelectedContactProfile,
  hasDomains
}: ContactProfileSectionProps) => {
  // Return null to completely remove the component from rendering
  return null;
};

export default ContactProfileSection;
