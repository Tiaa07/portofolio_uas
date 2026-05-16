import { useState } from "react";
import { getValidationErrors } from "../utils/responseHelper";

/**
 * Custom hook for automated form handling and validation
 * @param {object} initialValues - Initial form state
 * @param {function} submitCallback - Function to call on submit
 */
export const useForm = (initialValues, submitCallback) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    setLoading(true);
    setErrors({});
    
    try {
      await submitCallback(form);
    } catch (error) {
      // Automate validation error extraction
      const validationErrors = getValidationErrors(error);
      setErrors(validationErrors);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialValues);
    setErrors({});
  };

  return {
    form,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setErrors,
    setForm,
    resetForm
  };
};
