import { Link } from 'react-router-dom';

const FormContainer = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link 
          to={"../"}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back
          </Link> 
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          {title}
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;