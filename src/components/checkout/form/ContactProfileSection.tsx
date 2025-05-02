
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

const ContactProfileSection = ({ 
  profiles, 
  isLoadingProfiles, 
  selectedContactProfile, 
  setSelectedContactProfile,
  hasDomains
}: ContactProfileSectionProps) => {
  if (!hasDomains) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Contato</CardTitle>
        <CardDescription>
          Selecione um perfil de contato para titularidade dos domínios
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingProfiles ? (
          <div className="text-center py-4">Carregando perfis de contato...</div>
        ) : profiles.length > 0 ? (
          <RadioGroup 
            value={selectedContactProfile || undefined}
            onValueChange={setSelectedContactProfile}
          >
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div 
                  key={profile.id} 
                  className={`flex items-center justify-between border rounded-md p-4 ${
                    selectedContactProfile === profile.id ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={profile.id} id={`profile-${profile.id}`} />
                    <Label htmlFor={`profile-${profile.id}`} className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{profile.name}</span>
                    </Label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {profile.document}
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        ) : (
          <div className="text-center py-4 space-y-4">
            <p>Você não possui perfis de contato cadastrados</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactProfileSection;
