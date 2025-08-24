const validateContact = (contact) => {
  const errors = [];

  if (!contact.firstName || contact.firstName.trim().length === 0) {
    errors.push('First name is required');
  }

  if (!contact.lastName || contact.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  if (!contact.email || contact.email.trim().length === 0) {
    errors.push('email is required');
  } else if (!validateEmail(contact.email)) {
    errors.push('Invalid email format');
  }

  if (!contact.lastName || contact.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  if(!contact.position || contact.position.trim().length === 0) {
    errors.push('Position is required');
  }

  if(!contact.company || contact.company.trim().length === 0) {
    errors.push('Company is required');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (password.length < 8) return false;
  return true;
};

const validatePhone = (phone) => {
  const phoneNum = parseInt(phone);
  return !isNaN(phoneNum) && phone.length >= 7;
};

export { 
  validateEmail,
  validatePassword,
  validatePhone,
  validateContact
};