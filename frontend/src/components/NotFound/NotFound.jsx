import { useNavigate } from 'react-router-dom';

const NotFound = ({ title = "Not Found", message = "The resource you're looking for doesn't exist." }) => {
  const navigate = useNavigate();

  return (
    <div className="p-10 min-h-screen bg-gray-50 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ← Go Back
      </button>
    </div>
  );
};

export default NotFound;
