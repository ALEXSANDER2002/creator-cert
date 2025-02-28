
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
        
        <div className="p-6 overflow-auto flex justify-center">
          <div 
            ref={certificateRef} 
            className="certificate-paper bg-white shadow-lg w-full max-w-4xl aspect-[1.414/1] relative"
            style={{ fontFamily: 'serif' }}
          >
            {/* Curvas verdes laterais */}
            <div className="absolute top-0 left-0 w-1/4 h-full bg-emerald-600" style={{ borderTopRightRadius: '100%' }}></div>
            <div className="absolute bottom-0 right-0 w-1/4 h-full bg-emerald-600" style={{ borderTopLeftRadius: '100%' }}></div>
            
            {/* Logo e conteúdo do certificado */}
            <div className="relative z-10 p-8 flex flex-col items-center h-full">
              {/* Logo e cabeçalho */}
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src="/lovable-uploads/2e3cfeef-28af-43b6-904b-72236c11a39f.png" 
                  alt="Logo Engenheiros Sem Fronteiras" 
                  className="w-60"
                />
              </div>
              
              {/* Conteúdo do certificado */}
              <div className="w-full text-center px-4 mt-4">
                <h2 className="text-xl font-bold mb-4">CERTIFICAMOS QUE</h2>
                <h1 className="text-3xl font-bold text-emerald-600 mb-10">{data.name.toUpperCase()}</h1>
                
                <div className="text-base mb-10 mx-auto max-w-3xl text-justify">
                  <p>
                    inscrito sob a cédula de CPF <span className="font-bold">{data.cpf}</span>,
                    participou da Direção da Organização Não-Governamental{" "}
                    <span className="font-bold">ENGENHEIROS SEM FRONTEIRAS - {data.courseType.toUpperCase()}</span>{" "}
                    como <span className="font-bold">ASSESSOR FINANCEIRO</span>, entre{" "}
                    <span className="font-bold">agosto de 2023</span> a{" "}
                    <span className="font-bold">janeiro de 2025</span>, contabilizando carga horária
                    total de <span className="font-bold">480 horas</span>.
                  </p>
                </div>
              </div>
              
              {/* Assinaturas */}
              <div className="mt-auto flex justify-center w-full gap-24 mb-8">
                <div className="text-center">
                  <div className="w-56 border-t border-emerald-600 mb-2"></div>
                  <p className="text-emerald-600 font-medium uppercase">Guilherme da Silva Araujo</p>
                  <p className="text-xs italic">
                    Diretor-geral do ENGENHEIROS<br />SEM FRONTEIRAS - {data.courseType.toUpperCase()}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-56 border-t border-emerald-600 mb-2"></div>
                  <p className="text-emerald-600 font-medium uppercase">Prof. Dr. Pedro Ayala Castillo</p>
                  <p className="text-xs italic">
                    Coordenador do ENGENHEIROS<br />SEM FRONTEIRAS - {data.courseType.toUpperCase()}
                  </p>
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
