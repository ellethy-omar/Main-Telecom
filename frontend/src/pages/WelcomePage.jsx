import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();
  const goToRegister = () => navigate('/register');
  const goToLogin = () => navigate('/login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome!</h1>
          <p className="text-lg text-gray-600">
            Get started by creating an account or signing in
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={goToRegister}
            className="w-full block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-150 ease-in-out transform hover:scale-105"
          >
            Create New Account
          </button>
          
          <button
            onClick={goToLogin}
            className="w-full block bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition duration-150 ease-in-out transform hover:scale-105"
          >
            Sign In
          </button>
          
          <p className="text-sm text-gray-500">
            Join us today or access your existing account
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;