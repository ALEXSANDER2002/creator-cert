
/**
 * Validates if a string is a valid CPF (Brazilian ID)
 */
export const isValidCPF = (cpf: string): boolean => {
  // Remove special characters
  cpf = cpf.replace(/[^\d]/g, '');

  // Check if the length is correct
  if (cpf.length !== 11) return false;

  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Calculate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  // Check first verification digit
  if (parseInt(cpf.charAt(9)) !== digit1) return false;

  // Calculate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;

  // Check second verification digit
  return parseInt(cpf.charAt(10)) === digit2;
};

/**
 * Formats a CPF string with dots and dash
 */
export const formatCPF = (cpf: string): string => {
  // Remove non-digit characters
  cpf = cpf.replace(/\D/g, '');
  
  // Format with dots and dash (###.###.###-##)
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Validates if a string is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
