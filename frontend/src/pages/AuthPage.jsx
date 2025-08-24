import UserForm from '../components/Form/UserForm';

const AuthPage = ({ onBack, mode }) => {
  return <UserForm onBack={onBack} mode={mode} />;
};

export default AuthPage;