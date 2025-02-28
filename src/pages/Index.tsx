
import { useState } from "react";
import CertificateForm from "@/components/CertificateForm";
import CertificatePreview from "@/components/CertificatePreview";
import { CertificateData } from "@/utils/certificate";

const Index = () => {
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);

  const handleFormSubmit = (data: CertificateData) => {
    setCertificateData(data);
  };

  const handleClosePreview = () => {
    setCertificateData(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 certificate-bg">
      <div className="w-full max-w-4xl animate-fade-in">
        <CertificateForm onSubmit={handleFormSubmit} />
        
        {certificateData && (
          <CertificatePreview 
            data={certificateData} 
            onClose={handleClosePreview} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
