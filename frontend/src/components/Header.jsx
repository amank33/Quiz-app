import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useLogout from '../auth/Logout';
import useGlobalContextProvider from '../hooks/ContextApi';
import { lookInSession } from '../common/session';

// function head(){

//     return(
//         <Header/>
//     )
// }

export default function Header({
  navItems = [
    { label: 'Home', href: '/dashboard' },
    // { label: 'Careers', href: '#' },
    // { label: 'History', href: '#' },
    // { label: 'Services', href: '#' },
    // { label: 'Projects', href: '#' },
    // { label: 'Blog', href: '#' }
  ],
  profileMenuItems = [{ label: 'Update Profile', href: '/update-profile' }],
  userProfile1 = {
    fullname: 'User fullname',
    username: 'View username',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
}) {
  // debugger;
  const userGet = JSON.parse(lookInSession('user'));
  const userData = userGet?.user;

  let userProfile = {
    fullname: userData?.fullname,
    username: '@' + userData?.username,
    role: userData?.role,
    image:
      userData?.profile_img ||
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };
  console.log(userProfile,'userProfile');

  // let userProfile1 = {
  //     name: 'User Profile',
  //     subtitle: 'View your profile',
  //     image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  // }
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //const [isSidenavOpen, setIsSidenavOpen] = useState(false)
  const { isSidenavOpen, setIsSidenavOpen } = useGlobalContextProvider();
  const logout = useLogout();

  const menuRef = useRef(null);
  const sidenavRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (sidenavRef.current && !sidenavRef.current.contains(event.target)) {
        setIsSidenavOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  return (
    <>
      {/* Add a div wrapper to handle the layout shift */}
      <motion.div
        //   className={`${isSidenavOpen ? 'md:pl-64' : ''} transition-padding duration-300`}
        //   animate={{ paddingLeft: isSidenavOpen ? '16rem' : '0rem' }}
        //   initial="hidden"
        //    animate="visible"
        //   transition={{ duration: 1 }}
        //   variants={{
        //     hidden: { opacity: 0, y: -70 },
        //     visible: { opacity: 1, y: 0 },
        //   }}
        className={`transition-padding duration-300`}
        initial='hidden'
        animate={isSidenavOpen ? 'open' : 'closed'}
        variants={{
          hidden: { opacity: 0, y: -70 },
          open: { opacity: 1, y: 0, paddingLeft: '16rem' },
          closed: { opacity: 1, y: 0, paddingLeft: '0rem' },
        }}
        transition={{ duration: 0.5 }}
      >
        {/* <div className={`${isSidenavOpen ? 'md:pl-64' : ''} transition-padding duration-300`}></div> */}
        <header className='relative border-b bg-white'>
          <div className='mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8'>
            <div className='flex h-16 items-center justify-between'>
              <div className='flex-1 md:flex md:items-center md:gap-12'>
                <a className='block text-teal-600' href='#'>
                  <span className='sr-only'>Home</span>
                  <svg
                    className='h-8'
                    viewBox='0 0 28 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z'
                      fill='currentColor'
                    />
                  </svg>
                </a>
              </div>

              <div className='md:flex md:items-center md:gap-12'>
                <nav aria-label='Global' className='hidden md:block'>
                  <ul className='flex items-center gap-6 text-sm'>
                    {navItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.href}
                          className='text-gray-500 transition hover:text-gray-500/75'
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className='hidden md:relative md:block' ref={menuRef}>
                  <button
                    onClick={toggleMenu}
                    type='button'
                    className='overflow-hidden rounded-full border border-gray-300 shadow-inner flex'
                  >
                    <span className='sr-only'>Toggle dashboard menu</span>

                    <img src={userProfile.image} alt='' className='size-10 object-cover' />
                    {/* <div className='flex flex-col items-end pr-2'>
                              <p className='text-sm font-medium text-gray-700'>
                                {userProfile.fullname}
                              </p>
                              <p className='text-xs text-gray-500'>{userProfile.username}</p>
                            </div> */}
                  </button>
                  {/* <div className='ml-2 flex flex-col items-end'>
                              <p className='text-sm font-medium text-gray-700'>
                                {userProfile.fullname}
                              </p>
                              <p className='text-xs text-gray-500'>{userProfile.username}</p>
                            </div> */}

                  {isMenuOpen && (
                    <div
                      className='absolute end-0 z-100 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg'
                      role='menu'
                    >
                      <div className='p-2'>
                        {profileMenuItems.map((item, index) => (
                          <Link
                            key={index}
                            to={item.href}
                            className='block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            role='menuitem'
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      {/* <div className="p-2" id='openImage'>
                                            <form method="POST" action="#">
                                                <button
                                                    type="submit"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        logout();
                                                    }}
                                                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                                    role="menuitem"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                                                        />
                                                    </svg>

                                                    Logout
                                                    <div className="flex flex-col items-end justify-self-end">
                                                      <p className="text-sm font-medium text-gray-700">{userProfile.fullname}</p>
                                                     <p className="text-xs text-gray-500">{userProfile.username}</p>
                                                    </div>
                                                </button>
                                            </form>
                                        </div> */}
                      <div className='p-2' id='openImage'>
                        <form method='POST' action='#'>
                          <button
                            type='submit'
                            onClick={(e) => {
                              e.preventDefault();
                              logout();
                            }}
                            className='flex w-full items-center justify-between gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50'
                            role='menuitem'
                          >
                            <div className='flex items-center gap-2'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth='1.5'
                                stroke='currentColor'
                                className='h-5 w-5'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3'
                                />
                              </svg>
                              <span>Logout</span>
                            </div>
                            <div className='ml-2 flex flex-col items-end'>
                              <p className='text-sm font-medium text-gray-700'>
                                {userProfile.fullname}
                              </p>

                              <p className='text-xs text-gray-500'>{userProfile.username}{userProfile.role=='admin'?'(admin)':''}</p>
                            </div>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                <div className='block md:hidden'>
                  <button
                    onClick={toggleSidenav}
                    className='rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='size-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M4 6h16M4 12h16M4 18h16'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidenav */}
          {isSidenavOpen && (
            <>
              {/* Overlay - only visible on mobile */}
              <div
                className='fixed inset-0 z-40 bg-black/30 md:hidden'
                onClick={() => setIsSidenavOpen(false)}
              />

              {/* Sidenav */}
              <div
                ref={sidenavRef}
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                  isSidenavOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <div className='flex items-center justify-between border-b p-4'>
                  <span className='text-base font-medium'>Menu</span>
                  <button
                    onClick={toggleSidenav}
                    className='rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='size-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>

                <nav className='flex h-[calc(100vh-80px)] flex-col justify-between'>
                  <div className='p-4'>
                    <ul className='space-y-1'>
                      {navItems.map((item, index) => (
                        <li key={index}>
                          <Link
                            to={item.href}
                            className='block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            onClick={() => setIsSidenavOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Profile section at bottom */}
                  <div className='mt-auto border-t'>
                    <div className='p-4'>
                      <div className='mb-3 flex items-center gap-3'>
                        <img
                          src={userProfile.image}
                          alt=''
                          className='size-8 rounded-full object-cover'
                        />
                        <div>
                          <p className='text-sm font-medium text-gray-700'>
                            {userProfile.fullname}
                          </p>
                          <p className='text-xs text-gray-500'>{userProfile.username}{userProfile.role=='admin'?'(admin)':''}</p>
                        </div>
                      </div>
                      <ul className='space-y-1 border-t pt-3'>
                        {profileMenuItems.map((item, index) => (
                          <li key={index}>
                            <Link
                              to={item.href}
                              className='block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              logout();
                            }}
                            className='flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth='1.5'
                              stroke='currentColor'
                              className='size-4'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3'
                              />
                            </svg>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
            </>
          )}
        </header>
        {/* </div> */}
      </motion.div>
    </>
  );
}

// import { useState, useRef, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { motion } from "framer-motion";
// import useLogout from '../auth/Logout';
// import useGlobalContextProvider from '../hooks/ContextApi';

// export default function Header({
//     navItems = [
//         { label: 'About', href: '#' },
//         { label: 'Careers', href: '#' },
//         { label: 'History', href: '#' },
//         { label: 'Services', href: '#' },
//         { label: 'Projects', href: '#' },
//         { label: 'Blog', href: '#' }
//     ],
//     profileMenuItems = [
//         { label: 'My Profile', href: '#' },
//         { label: 'Team Settings', href: '#' }
//     ],
//     userProfile = {
//         name: 'User Profile',
//         subtitle: 'View your profile',
//         image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
//     },
// }) {
//     const [isMenuOpen, setIsMenuOpen] = useState(false)
//     const { isSidenavOpen, setIsSidenavOpen } = useGlobalContextProvider();
//     const logout = useLogout();

//     const menuRef = useRef(null)
//     const sidenavRef = useRef(null)

//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (menuRef.current && !menuRef.current.contains(event.target)) {
//                 setIsMenuOpen(false)
//             }
//             if (sidenavRef.current && !sidenavRef.current.contains(event.target)) {
//                 setIsSidenavOpen(false)
//             }
//         }

//         document.addEventListener('mousedown', handleClickOutside)
//         return () => document.removeEventListener('mousedown', handleClickOutside)
//     }, [])

//     const toggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen)
//     }

//     const toggleSidenav = () => {
//         setIsSidenavOpen(!isSidenavOpen)
//     }

//     return(
//         <>
//         <motion.div
//           className={`${isSidenavOpen ? 'md:pl-64' : ''} transition-padding duration-300`}
//           animate={{ paddingLeft: isSidenavOpen ? '16rem' : '0rem' }}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: false, amount: 0.6 }}
//           transition={{ duration: 1 }}
//           exit={{ opacity: 0, scale: 0.95 }}
//           variants={{
//             hidden: { opacity: 0, y: 50 },
//             visible: { opacity: 1, y: 0 },
//           }}
//         >
//             <motion.header
//               className="bg-white relative border-b"
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//                 <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//                     <motion.div
//                       className="flex h-16 items-center justify-between"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.2 }}
//                     >
//                         <motion.div
//                           className="flex-1 md:flex md:items-center md:gap-12"
//                           initial={{ x: -50, opacity: 0 }}
//                           animate={{ x: 0, opacity: 1 }}
//                           transition={{ delay: 0.3 }}
//                         >
//                             <a className="block text-teal-600" href="#">
//                                 <span className="sr-only">Home</span>
//                                 <motion.svg
//                                   className="h-8" viewBox="0 0 28 24" fill="none"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   initial={{ rotate: -90, opacity: 0 }}
//                                   animate={{ rotate: 0, opacity: 1 }}
//                                   transition={{ delay: 0.5, type: 'spring' }}
//                                 >
//                                     {/* SVG Path */}
//                                 </motion.svg>
//                             </a>
//                         </motion.div>

//                         <motion.div
//                           className="md:flex md:items-center md:gap-12"
//                           initial={{ x: 50, opacity: 0 }}
//                           animate={{ x: 0, opacity: 1 }}
//                           transition={{ delay: 0.3 }}
//                         >
//                             <nav aria-label="Global" className="hidden md:block">
//                                 <motion.ul
//                                   className="flex items-center gap-6 text-sm"
//                                   initial="hidden"
//                                   animate="visible"
//                                   variants={{
//                                     hidden: {},
//                                     visible: {
//                                       transition: {
//                                         staggerChildren: 0.1
//                                       }
//                                     }
//                                   }}
//                                 >
//                                     {navItems.map((item, index) => (
//                                         <motion.li
//                                           key={index}
//                                           variants={{
//                                             hidden: { opacity: 0, y: 10 },
//                                             visible: { opacity: 1, y: 0 }
//                                           }}
//                                         >
//                                             <Link
//                                                 to={item.href}
//                                                 className="text-gray-500 transition hover:text-gray-500/75"
//                                             >
//                                                 {item.label}
//                                             </Link>
//                                         </motion.li>
//                                     ))}
//                                 </motion.ul>
//                             </nav>
//                             {/* Continue with other parts of the header... */}
//                         </motion.div>
//                     </motion.div>
//                 </div>
//             </motion.header>
//         </motion.div>
//         </>
//     )
// }
