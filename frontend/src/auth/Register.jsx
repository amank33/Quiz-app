import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { toast1 } from 'src/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { getRegisterData } from '../api/functions/register';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';

function Register({ toggleCount, setVariant, localStorageData, setLocalStorageData }) {
  const [registerData, setRegisterData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [registerError, setRegisterError] = useState({
    fullnameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

  useEffect(() => {
    setRegisterError({ fullnameError: '', emailError: '', passwordError: '' });
  }, [toggleCount]);

  const handleRegisterDataChange = (e) => {
    setRegisterData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit =  () => {
    setRegisterError({
      fullnameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    });

    if (
      registerData.fullname === '' ||
      registerData.email === '' ||
      registerData.password === '' ||
      registerData.confirmPassword === ''
    ) {
      if (registerData.fullname === '') {
        setRegisterError((prev) => ({ ...prev, fullnameError: 'Full Name is required' }));
      }
      if (registerData.email === '') {
        setRegisterError((prev) => ({ ...prev, emailError: 'Email is required' }));
      }
      if (registerData.password === '') {
        setRegisterError((prev) => ({ ...prev, passwordError: 'Password is required' }));
      }
      if (registerData.confirmPassword === '') {
        setRegisterError((prev) => ({
          ...prev,
          confirmPasswordError: 'Please confirm your password',
        }));
      }
      return;
    }

    if (registerData.fullname.length < 3) {
      setRegisterError((prev) => ({
        ...prev,
        fullnameError: 'Full Name must be at least 3 characters long',
      }));
      return;
    }
    if (!emailRegex.test(registerData.email)) {
      setRegisterError((prev) => ({ ...prev, emailError: 'Invalid email format' }));
      return;
    }

    if (!passwordRegex.test(registerData.password)) {
      setRegisterError((prev) => ({
        ...prev,
        passwordError:
          'Password must be 6-20 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      }));
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError((prev) => ({ ...prev, confirmPasswordError: 'Passwords do not match' }));
      return;
    }

    const dataToRegister = {
      fullname: registerData.fullname,
      email: registerData.email,
      password: registerData.password,
    };
    setRegisterData({ fullname: '', email: '', password: '', confirmPassword: '' });
    setRegisterError({
      fullnameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    });
    debugger;
    getRegisterData(dataToRegister).then((flag) => {
      if (flag) {
        toast.success('Account created successfully, please login now!');
        setVariant('LOGIN');
        setLocalStorageData((prev) => ({ ...prev, email: registerData.email }));
        localStorage.setItem('registeredEmail', registerData.email);
      } else {
        toast.error('Could not create your account!');
      }
    });
  };

  return (
    <div className='flex h-full w-full flex-col items-center justify-center bg-white p-8'>
      <h2 className='mb-6 text-3xl font-semibold'>Create Account</h2>

      <p className='mb-8 text-gray-500'>or use your email for registration</p>

      <form className='w-full max-w-sm space-y-4'>
        <div>
          <input
            type='text'
            placeholder='Full Name'
            name='fullname'
            value={registerData.fullname}
            onChange={handleRegisterDataChange}
            className='w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none'
          />
          {registerError.fullnameError && (
            <p className='mt-1 text-sm text-red-500'>{registerError.fullnameError}</p>
          )}
        </div>

        <div>
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={registerData.email}
            onChange={handleRegisterDataChange}
            className='w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none'
          />
          {registerError.emailError && (
            <p className='mt-1 text-sm text-red-500'>{registerError.emailError}</p>
          )}
        </div>

        {/* <div>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={registerData.password}
            onChange={handleRegisterDataChange}
            className='w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none'
          />
          {registerError.passwordError && (
            <p className='mt-1 text-sm text-red-500'>{registerError.passwordError}</p>
          )}

        </div>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            name='password'
            value={registerData.password}
            onChange={handleRegisterDataChange}
            className='w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none'
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
          {registerError.passwordError && (
            <p className='mt-1 text-sm text-red-500'>{registerError.passwordError}</p>
          )}
        </div> */}
        <div className='relative'>
          <div className='relative h-10'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              name='password'
              value={registerData.password}
              onChange={handleRegisterDataChange}
              className='w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none'
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
          {registerError.passwordError && (
            <p className='mt-1 text-sm text-red-500'>{registerError.passwordError}</p>
          )}
        </div>

        <div>
          <input
            type='password'
            placeholder='Confirm Password'
            name='confirmPassword'
            value={registerData.confirmPassword}
            onChange={handleRegisterDataChange}
            className='w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none'
          />
          {registerError.confirmPasswordError && (
            <p className='mt-1 text-sm text-red-500'>{registerError.confirmPasswordError}</p>
          )}
        </div>

        <button
          type='button'
          onClick={handleSubmit}
          className='w-full rounded-full bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none'
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;
