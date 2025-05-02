
import { useState } from 'react';

export const useDomainSelection = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTab, setDialogTab] = useState("register");
  const [domainName, setDomainName] = useState("");
  const [isDomainValid, setIsDomainValid] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowDialog(true);
    setIsDomainValid(false);
    setDomainName("");
  };

  const handleDomainValidated = (domain: string) => {
    setDomainName(domain);
    setIsDomainValid(true);
  };

  return {
    showDialog,
    setShowDialog,
    dialogTab,
    setDialogTab,
    domainName,
    isDomainValid,
    selectedPlan,
    setSelectedPlan,
    handlePlanSelect,
    handleDomainValidated
  };
};
