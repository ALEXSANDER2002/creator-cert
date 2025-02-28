
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
            className="certificate-paper aspect-video w-full p-10 flex flex-col justify-between"
          >
            <div className="border-b border-t border-r border-l border-gray-300 p-8 w-full h-full flex flex-col">
              <div className="text-center mb-8">
                <div className="text-sm uppercase tracking-wide text-gray-500 mb-3">Certificado de Conclusão</div>
                <h1 className="text-3xl font-serif text-primary">{courseType}</h1>
              </div>
              
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-gray-600 mb-4">Certificamos que</p>
                <p className="text-2xl font-serif mb-4 text-primary">{data.name}</p>
                <p className="text-gray-600 mb-2">portador(a) do CPF {data.cpf}</p>
                <p className="text-gray-600 mb-6">participou e concluiu com sucesso o</p>
                <p className="text-xl font-medium mb-6 text-primary">{courseType}</p>
                <p className="text-gray-600">com carga horária total de 40 horas.</p>
              </div>

              <div className="text-center mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-sm mb-2">Documento emitido em {formatDate(data.generatedDate)}</p>
                <div className="w-48 h-12 mx-auto border-b border-gray-400 mb-2"></div>
                <p className="text-gray-600 text-sm">Assinatura do Responsável</p>
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
              className="flex items-center gap-1 px-3 py-2 rounded bg-primary hover:bg-primary/90 transition-colors text-white"
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
