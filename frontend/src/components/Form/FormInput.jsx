const FormInput = ({ 
  id, 
  name, 
  type, 
  value, 
  onChange, 
  placeholder, 
  label, 
  error, 
  helpText 
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormInput;