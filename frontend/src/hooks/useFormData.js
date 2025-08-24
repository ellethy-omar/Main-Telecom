import { useState } from 'react';

const useFormData = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phone' ? parseInt(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    resetForm
  };
};

export default useFormData;