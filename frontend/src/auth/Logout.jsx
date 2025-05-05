import { useNavigate } from 'react-router-dom';
import { removeFromSession,logOutUser } from '../common/session';
import useGlobalContextProvider from '../hooks/ContextApi';

export default function useLogout() {
  const { setUserAuth } = useGlobalContextProvider();
  const navigate = useNavigate();

  const logout = () => {
    console.log('Logging out...');
    removeFromSession("user");
    logOutUser();
    setUserAuth(null);
    
    window.location.href = '/';
  };

  return logout;
}