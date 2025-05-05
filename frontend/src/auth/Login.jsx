import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { toast1 } from 'src/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginData } from '../api/functions/login'; // Import your API function here
import useGlobalContextProvider from '../hooks/ContextApi';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import Modal from 'react-modal'; 
import axios from 'axios';

function Login({ toggleCount, setVariant, localStorageData, setLocalStorageData }) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState({ emailError: '', passwordError: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [resetEmail, setResetEmail] = useState(''); // State for reset email

  const { userAuth, setUserAuth,setUserRole } = useGlobalContextProvider();

  const navigate = useNavigate();
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

  useEffect(() => {
    setLoginError({ emailError: '', passwordError: '' });
    // Set email from registration if available
  }, [toggleCount]);

  useEffect(() => {
    if (localStorageData && localStorageData.email) {
      const registeredEmail = localStorageData.email;
      setLoginData((prev) => ({ ...prev, email: registeredEmail }));
    }
  }, [localStorageData]);

  const handleLoginDataChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    setLoginError({ emailError: '', passwordError: '' });

    if (loginData.email === '' || loginData.password === '') {
      if (loginData.email === '') {
        setLoginError((prev) => ({ ...prev, emailError: 'Email is required' }));
      }
      if (loginData.password === '') {
        setLoginError((prev) => ({ ...prev, passwordError: 'Password is required' }));
      }
      return;
    } else {
      if (!emailRegex.test(loginData.email)) {
        setLoginError((prev) => ({ ...prev, emailError: 'Invalid email format' }));
        return;
      }
      if (!passwordRegex.test(loginData.password)) {
        setLoginError((prev) => ({
          ...prev,
          passwordError:
            'Password must be 6-20 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
        }));
        return;
      }
    }
    
    console.log(userAuth, 'userAuth');
     getLoginData(loginData).then((flag) => {
      if (flag) {
        setUserAuth(flag.accessToken);
        setUserRole(flag.user.role);
        toast.success('Logged in successfully!');
        navigate("/dashboard"); // Redirect to home page after successful login
      } else {
        toast.error('Could not login!');
      }
    });
  };

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };

  const handleResetPassword = async() => {
    if (!resetEmail) {
      toast.error('Please enter your email');
      return;
    }
    // Call API to reset password (placeholder)
    //debugger;
    await sendPasswordResetEmail(resetEmail)
    
      // .then(() => {
      //   toast.success('Password reset link sent to your email');
      //   setIsModalOpen(false);
      // })
      // .catch((error) => {
      //   toast.error('Error sending password reset link:', error);
      // });
    //toast.success('Password reset link sent to your email');
    //setIsModalOpen(false);
  };

  async function sendPasswordResetEmail(email) {
              try {
                  const baseUrl = String(import.meta.env.VITE_API_BASE_URL);
  
                  const response = await axios.get(`${baseUrl}/api/auth/forgot-password-email/${email}`, {
                    headers: { 'Content-Type': 'application/json' },              
                  })
                
               // debugger;

                   console.log(response.data,'response.data');
                   setIsModalOpen(false);
                   toast.success('Password reset link sent to your email');
                   
                   //return response.data
  
              } catch (error) {
                  toast.error('Error sending password reset link email:', error);
              }
          }

  return (
    <div className='flex h-full w-full flex-col items-center justify-center bg-white p-8'>
      <h2 className='mb-6 text-3xl font-semibold'>Sign In</h2>

      <form className='w-full max-w-[300px] space-y-4'>
        <div>
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={loginData.email}
            onChange={handleLoginDataChange}
            className='w-full border-b-2 border-gray-300 px-4 py-2 text-gray-700 transition-colors outline-none focus:border-emerald-500'
          />
          {loginError.emailError && (
            <p className='mt-1 text-sm text-red-500'>{loginError.emailError}</p>
          )}
        </div>

        <div className='relative'>
          <div className='relative h-10'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              name='password'
              value={loginData.password}
              onChange={handleLoginDataChange}
              className='w-full border-b-2 border-gray-300 px-4 py-2 text-gray-700 transition-colors outline-none focus:border-emerald-500'
            />
            {showPassword ? (
              <AiOutlineEye
                className='absolute top-1/2 right-2 -mt-2 text-gray-500 hover:text-gray-600'
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className='absolute top-1/2 right-2 -mt-2 text-gray-500 hover:text-gray-600'
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
          {loginError.passwordError && (
            <p className='mt-1 text-sm text-red-500'>{loginError.passwordError}</p>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <a
            href='#'
            className='text-sm text-emerald-500 hover:underline'
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </a>
        </div>

        <button
          type='button'
          onClick={handleSubmit}
          className='mt-6 w-full rounded-full bg-emerald-500 px-4 py-2 text-white transition-colors hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none'
        >
          Sign In
        </button>

        <div className='flex items-center justify-center gap-2' id='custom'>
        <button className='px-6 py-2 bg-[#00df9a] rounded-md text-white font-medium hover:bg-[#00bf82] transition-colors'
         onClick={(e) => {
          e.preventDefault();
          setLoginData({ email: 'man@yopmail.com', password: 'Bitwise@333' });
        }}
        >
          Use Admin credentials
        </button>
        <button className='px-6 py-2 bg-[#00df9a] rounded-md text-white font-medium hover:bg-[#00bf82] transition-colors'
        onClick={(e) => {
          e.preventDefault();
          setLoginData({ email: 'aman@yopmail.com', password: 'Bitwise@333' });
        }}
        >
          Use User credentials
          </button>
        </div>
        


      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel='Forgot Password Modal'
        className='custom-modal' // Updated to use correct class
        overlayClassName='custom-overlay' // Updated to use correct class
      >
        <h2 className='text-xl font-semibold mb-4'>Reset Password</h2>
        <input
          type='email'
          placeholder='Enter your email'
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          className='w-full border-b-2 border-gray-300 px-4 py-2 text-gray-700 transition-colors outline-none focus:border-emerald-500'
        />
        <button
          onClick={handleResetPassword}
          className='mt-4 w-full rounded-full bg-emerald-500 px-4 py-2 text-white transition-colors hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none'
        >
          Reset Password
        </button>
      </Modal>
    </div>
  );
}

export default Login;
