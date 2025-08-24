import { useState } from 'react';
import { validateEmail, validatePassword, validatePhone } from '../utils/validations';

const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateForm = (formData, isLoginMode = false) => {
    const newErrors = {};

    if (!isLoginMode) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }

      if (!validatePhone(formData.phone.toString())) {
        newErrors.phone = 'Phone number must be at least 7 digits';
      }
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  return {
    errors,
    validateForm,
    clearFieldError
  };
};

export default useFormValidation;