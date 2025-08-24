import { useEffect } from 'react';
import './AlertSessionExpire.css';
import { useAuth } from '../../contexts/AuthContext';

const AlertSessionExpire = () => {
  const { forceLogout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      forceLogout();
    }, 3000);

    return () => clearTimeout(timer);
  }, [forceLogout]);

  return (

    <div className="alert-session-expire">
      <strong>Session Expired!!!</strong><br />
      You will be logged out shortly...
    </div>
  );
};

export default AlertSessionExpire;
