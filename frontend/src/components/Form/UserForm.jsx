import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import Alert from "../Alert/Alert";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";
import useFormData from "../../hooks/useFormData";
import useFormValidation from "../../hooks/useFormValidation";
import { useAuth } from "../../contexts/AuthContext";


const INITIAL_FORM_STATE = {
  firstName: '',
  lastName: '',
  phone: 0,
  email: '',
  password: ''
};

const UserForm = ({ onBack, mode = 'register' }) => {
  const { formData, handleInputChange, resetForm } = useFormData(INITIAL_FORM_STATE);
  const { errors, validateForm, clearFieldError } = useFormValidation();
  const { login, register } = useAuth();
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isLoginMode = mode === 'login';

  const handleFieldChange = (e) => {
    handleInputChange(e);
    clearFieldError(e.target.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(formData, isLoginMode)) {
      setAlert({
        message: 'Please fix the errors in the form',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = isLoginMode 
        ? await login({ email: formData.email, password: formData.password })
        : await register(formData);

      if (result.success) {
        setAlert({
          message: isLoginMode ? 'Login successful!' : 'Registration successful!',
          type: 'success'
        });
        resetForm();
        navigate('/dashboard/home');
      } else {
        setAlert({
          message: result.error,
          type: 'error'
        });
      }
    } catch (error) {
      setAlert({
        message: 'Something went wrong. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = isLoginMode ? 'User Login' : 'User Registration';
  const submitText = isLoginMode ? 'Login' : 'Register';

  return (
    <>
      <FormContainer title={title} onBack={onBack}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLoginMode && (
            <>
              <FormInput
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleFieldChange}
                placeholder="Enter your first name"
                label="First Name"
                error={errors.firstName}
              />

              <FormInput
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleFieldChange}
                placeholder="Enter your last name"
                label="Last Name"
                error={errors.lastName}
              />

              <FormInput
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone === 0 ? '' : formData.phone}
                onChange={handleFieldChange}
                placeholder="Enter your phone number"
                label="Phone Number"
                error={errors.phone}
              />
            </>
          )}

          <FormInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleFieldChange}
            placeholder="Enter your email address"
            label="Email Address"
            error={errors.email}
          />

          <FormInput
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleFieldChange}
            placeholder="Enter your password"
            label="Password"
            error={errors.password}
            helpText={!isLoginMode ? "Password must be at least 8 characters" : undefined}
          />

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Please wait...' : submitText}
            </button>
          </div>
        </form>
      </FormContainer>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
};

export default UserForm;