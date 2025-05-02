
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HostingHeader from '@/components/hosting/HostingHeader';
import HostingTypesSelector from '@/components/hosting/HostingTypesSelector';
import HostingPlans from '@/components/hosting/HostingPlans';
import HostingIncludedFeatures from '@/components/hosting/HostingIncludedFeatures';
import HostingCTA from '@/components/hosting/HostingCTA';

const Hosting = () => {
  const navigate = useNavigate();
  const [hostingType, setHostingType] = useState('shared');
  const [billingPeriod, setBillingPeriod] = useState('1');
  
  const handleViewDetails = (planTitle: string) => {
    // Mapear para o formato de URL
    const planSlug = planTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/hosting/${planSlug}?period=${billingPeriod}&type=${hostingType}`);
  };

  return (
    <Layout>
      <div className="container py-12">
        <HostingHeader />
        
        <HostingTypesSelector 
          hostingType={hostingType}
          setHostingType={setHostingType}
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
        />

        <HostingPlans 
          hostingType={hostingType}
          billingPeriod={billingPeriod}
          onViewDetails={handleViewDetails}
        />
      </div>
      
      <HostingIncludedFeatures />
      <HostingCTA />
    </Layout>
  );
};

export default Hosting;
