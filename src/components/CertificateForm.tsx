
import { useState } from "react";
import { User, Mail, FileDown, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { isValidCPF, formatCPF, isValidEmail } from "@/utils/validators";
import { certificateTypes, CertificateData } from "@/utils/certificate";

interface CertificateFormProps {
  onSubmit: (data: CertificateData) => void;
}

const CertificateForm = ({ onSubmit }: CertificateFormProps) => {
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [courseType, setCourseType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle CPF input change with formatting
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setCpf(value);
    }
  };

  // Format CPF for display
  const formattedCpf = cpf.length > 0 ? formatCPF(cpf.padEnd(11, '0')).substring(0, cpf.length + (cpf.length > 3 ? 1 : 0) + (cpf.length > 6 ? 1 : 0) + (cpf.length > 9 ? 1 : 0)) : cpf;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!cpf) {
      toast.error("O CPF é obrigatório");
      return;
    }
    
    if (!isValidCPF(cpf)) {
      toast.error("CPF inválido");
      return;
    }
    
    if (!name) {
      toast.error("O nome é obrigatório");
      return;
    }
    
    if (!email) {
      toast.error("O e-mail é obrigatório");
      return;
    }
    
    if (!isValidEmail(email)) {
      toast.error("E-mail inválido");
      return;
    }
    
    if (!courseType) {
      toast.error("Selecione um curso/palestra/treinamento");
      return;
    }

    // Proceed with form submission
    setIsSubmitting(true);
    
    // Create certificate data
    const certificateData: CertificateData = {
      cpf,
      name,
      email,
      courseType,
      generatedDate: new Date(),
    };

    try {
      // Call the onSubmit callback
      onSubmit(certificateData);
      toast.success("Certificado gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar certificado. Tente novamente.");
      console.error("Error generating certificate:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container animate-scale-in">
      <h1 className="text-3xl font-light text-center text-certificate-text mb-8">
        Gere seu certificado
      </h1>

      <div className="form-field">
        <label htmlFor="cpf" className="form-label">
          CPF
        </label>
        <div className="input-container">
          <CreditCard className="input-icon h-5 w-5" />
          <input
            id="cpf"
            type="text"
            value={formattedCpf}
            onChange={handleCpfChange}
            placeholder="Informe teu CPF"
            className="certificate-input"
            aria-label="CPF"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="name" className="form-label">
          Nome
        </label>
        <div className="input-container">
          <User className="input-icon h-5 w-5" />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Informe teu Nome Completo"
            className="certificate-input"
            aria-label="Nome completo"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="email" className="form-label">
          E-Mail
        </label>
        <div className="input-container">
          <Mail className="input-icon h-5 w-5" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Informe teu E-Mail"
            className="certificate-input"
            aria-label="E-mail"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="courseType" className="form-label">
          Curso/Palestra/Treinamento
        </label>
        <div className="input-container">
          <User className="input-icon h-5 w-5" />
          <select
            id="courseType"
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
            className="select-input"
            aria-label="Tipo de curso ou evento"
          >
            <option value="">Selecione o que você quer emitir o certificado</option>
            {certificateTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-certificate-accent hover:bg-primary text-white py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Gerando..." : "Gerar Certificado"} 
        <FileDown className="h-5 w-5" />
      </button>
    </form>
  );
};

export default CertificateForm;
