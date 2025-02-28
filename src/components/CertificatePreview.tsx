
import { useRef, useState, useEffect } from "react";
import { X, Download, Printer } from "lucide-react";
import { formatDate, getCertificateTypeLabel, CertificateData } from "@/utils/certificate";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CertificatePreviewProps {
  data: CertificateData;
  onClose: () => void;
}

const CertificatePreview = ({ data, onClose }: CertificatePreviewProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation effect on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    // In a real app, this would use window.print() or a library to print the certificate
    toast.success("Enviando para impressão...");
    setTimeout(() => {
      toast.info("Certificado enviado para impressão!");
    }, 1500);
  };

  const handleDownload = async () => {
    if (!certificateRef.current) {
      toast.error("Erro ao gerar o certificado. Tente novamente.");
      return;
    }

    try {
      toast.success("Preparando download...");
      
      // Gerar o canvas a partir do certificado
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Melhor qualidade
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      // Criar um novo documento PDF com dimensões baseadas no canvas
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Adicionar a imagem do canvas ao PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Salvar o PDF
      pdf.save(`certificado-${data.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      
      toast.info("Certificado baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Ocorreu um erro ao gerar o PDF. Tente novamente.");
    }
  };

  const courseType = getCertificateTypeLabel(data.courseType);

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto flex flex-col animate-slide-up">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-medium text-primary">Certificado Gerado</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-auto">
          <div 
            ref={certificateRef} 
            className="certificate-paper w-full aspect-[1.414/1] relative bg-white"
            style={{ fontFamily: 'serif' }}
          >
            {/* Curved green borders */}
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-emerald-600 rounded-br-[100%]"></div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-emerald-600 rounded-tl-[100%]"></div>
            
            {/* Logo and header */}
            <div className="relative z-10 p-8 pt-12">
              <div className="flex items-center justify-center mb-10">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 text-white">
                        {/* Simplified globe icon placeholder */}
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M3 12H21" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 3C14.5013 5.46452 15.9228 8.66283 16 12C15.9228 15.3372 14.5013 18.5355 12 21C9.49872 18.5355 8.07725 15.3372 8 12C8.07725 8.66283 9.49872 5.46452 12 3Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-left">
                      <h1 className="text-2xl font-bold text-black">Engenheiros</h1>
                      <h1 className="text-2xl font-bold text-black">Sem Fronteiras</h1>
                      <p className="text-emerald-600">Núcleo {data.courseType}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Certificate content */}
              <div className="text-center px-4">
                <h2 className="text-xl font-bold mb-8">CERTIFICAMOS QUE</h2>
                <h1 className="text-3xl font-bold text-emerald-600 mb-8">{data.name.toUpperCase()}</h1>
                
                <p className="text-base mb-6 max-w-3xl mx-auto text-left">
                  inscrito sob a cédula de CPF <span className="font-bold">{data.cpf}</span>, participou da 
                  Direção da Organização Não-Governamental <span className="font-bold">ENGENHEIROS SEM 
                  FRONTEIRAS - {data.courseType.toUpperCase()}</span> como <span className="font-bold">ASSESSOR FINANCEIRO</span>, entre 
                  <span className="font-bold"> agosto de 2023</span> a <span className="font-bold">janeiro de 2025</span>, contabilizando carga horária
                  total de <span className="font-bold">480 horas</span>.
                </p>
              </div>
              
              {/* Signatures */}
              <div className="mt-16 flex justify-between px-12">
                <div className="text-center">
                  <div className="w-40 h-0.5 bg-emerald-600 mb-1"></div>
                  <p className="text-emerald-600 font-medium">GUILHERME DA SILVA ARAUJO</p>
                  <p className="text-xs italic">Diretor-geral do ENGENHEIROS<br />SEM FRONTEIRAS - {data.courseType.toUpperCase()}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-40 h-16 flex items-end justify-center">
                    <img src="/lovable-uploads/e39dfdc7-82ff-425d-8a9c-d28eb84df40c.png" alt="Assinatura" className="w-24 opacity-70" style={{ transform: 'translateY(10px)' }} />
                  </div>
                  <div className="w-40 h-0.5 bg-emerald-600 mb-1"></div>
                  <p className="text-emerald-600 font-medium">PROF. DR. PEDRO AYALA CASTILLO</p>
                  <p className="text-xs italic">Coordenador do ENGENHEIROS<br />SEM FRONTEIRAS - {data.courseType.toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-between items-center bg-gray-50">
          <div className="text-sm text-gray-500">
            Certificado emitido para {data.email}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir</span>
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 transition-colors text-white"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
