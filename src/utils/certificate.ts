
/**
 * Certificate types available in the application
 */
export const certificateTypes = [
  { id: 'curso-react', label: 'Curso de React' },
  { id: 'curso-node', label: 'Curso de Node.js' },
  { id: 'workshop-ux', label: 'Workshop de UX/UI Design' },
  { id: 'palestra-ia', label: 'Palestra sobre Inteligência Artificial' },
  { id: 'treinamento-gestao', label: 'Treinamento em Gestão de Projetos' },
];

/**
 * Certificate data interface
 */
export interface CertificateData {
  cpf: string;
  name: string;
  email: string;
  courseType: string;
  generatedDate: Date;
}

/**
 * Generates a PDF certificate (placeholder)
 * In a real application, this would generate an actual PDF
 */
export const generateCertificate = (data: CertificateData): string => {
  // In a real application, this would use a library like jsPDF or pdfmake
  // to generate an actual PDF certificate
  
  // For now, we'll just return a placeholder URL that would represent
  // the generated certificate
  return `data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/...`;
};

/**
 * Gets the display name of a certificate type from its ID
 */
export const getCertificateTypeLabel = (id: string): string => {
  const type = certificateTypes.find(type => type.id === id);
  return type ? type.label : 'Certificado';
};

/**
 * Format date to a Brazilian format (dd/mm/yyyy)
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};
