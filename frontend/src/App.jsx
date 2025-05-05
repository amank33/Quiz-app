import { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Feature from '@components/Feature';
import Footer from '@components/Footer';
import Header from '@components/Header';


import { ContextProvider } from './hooks/ContextApi';
import { Toaster, toast } from "react-hot-toast";
import { Toaster1 } from './utils/toaster'

import { toast1 } from './hooks/use-toast';
import AuthForm from './auth/AuthForm'
import useGlobalContextProvider from './hooks/ContextApi';
import { Navigate, useNavigate,useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import { lookInSession } from './common/session';

//user pages
import QuizArea from '@pages/user/quiz/QuizArea';
import QuizStart from '@pages/user/quiz_start/QuizStart';
import UserAnalytics from '@pages/user/analytics/UserAnalytics';

//admin pages
import QuizAreaAdmin from '@pages/admin/allQuiz/QuizArea';
import QuizBuild from '@pages/admin/buildQuiz/QuizBuild';
import AllStudents from '@pages/admin/allStudents/AllStudents'
import AssignToStudents from '@pages/admin/AssignToStudents/AssignToStudents'
import Adminanalytics from '@pages/admin/analytics/AdminAnalytics';
import UpdateProfile from '@pages/UpdateProfile';

// Create components for different routes

const AdminLayout = ({data}) => (
 
  <>
    {/* for admin */}
    <div className="min-h-screen flex flex-col">
      
    <Header navItems={[
            { label: 'Home', href: '/dashboard' },
            { label: 'All quiz', href: '/AllQuiz' },
            { label: 'Assign quiz', href: '/AssignToStudents' },
            { label: 'All Students', href: '/AllStudents' },
          ]} 
          // profileMenuItems = {[{ label: 'Update Profile', href: '/update-profile-admin' }]}
           />
    <Main data={data} />
    <Footer />
    
    </div>
    </>
  
);
const StudentLayout = ({data}) => (
  <>
    {/* for students */}
    <div className="min-h-screen flex flex-col">
      
    <Header navItems={[
            { label: 'Home', href: '/dashboard' },
            { label: 'Take quiz', href: '/TakeQuiz' },
          ]}  />
    <Main data={data} />
    <Footer />
    
    </div>
    </>
);
function Main({data}) {
  const { isSidenavOpen } = useGlobalContextProvider();
  return(
    <>
    <main className="flex-grow py-8">
    <motion.div animate={{ paddingLeft: isSidenavOpen ? '16rem' : '0rem' }}>
    
    {data && data}      
    
    </motion.div>
    </main>
    
    
    </>
  )

}

const About = () => (
  <div className="container mx-auto px-4">
    <h1 className="text-4xl font-bold mb-4">About Us</h1>
    <p className="text-gray-600">Welcome to our about page!</p>
  </div>
);

const Services = () => (
  <div className="container mx-auto px-4">
    <h1 className="text-4xl font-bold mb-4">Our Services</h1>
    <p className="text-gray-600">Check out our services!</p>
  </div>
);

// function App1() {
  

//   return (
//     <>
//       <Toaster />
//       <Toaster1 />
//       <ContextProvider>
//       {/* authentication routes */}
//       <Router>
//         <Routes>
//           <Route path="/" element={<AuthForm />} />
          
//           {/* <Route path="/services" element={<Services />} /> */}
//         </Routes>
//       </Router>
    
//     {/* authenticated routes */}
    
//       <Router>
        
//             <Routes>
//               <Route path="/dashboard" element={<StudentPages />} />
//               <Route path="/TakeQuiz" element={<StudentPages  data={<QuizArea />}/>} />
//               <Route path="/quizStart" element={<QuizStart />} />
//               {/* <Route path="/services" element={<Services />} /> */}
//             </Routes>
         
//       </Router>

//       <Router>
        
//             <Routes>
//               <Route path="/dashboard" element={<AdminPages />} />
//               {/* <Route path="/TakeQuiz" element={<StudentPages  data={<QuizArea />}/>} />
//               <Route path="/quizStart" element={<QuizStart />} /> */}
//               {/* <Route path="/services" element={<Services />} /> */}
//             </Routes>
         
//       </Router>
//      </ContextProvider> 
//      </>
//   );
// }
function AppRoutes({isAuthenticated,role}) {
  
  // debugger;
   console.log(role, 'userRole');



  // // Simulate fetching authentication state from context or API
  // useEffect(() => {
  //   // Simulate loading (you can also make async calls if needed)
  //   debugger;
  //   if (userAuth) {
  //     setIsLoadingUser(false);
  //     if (location.pathname !== '/dashboard') {
  //       // Redirect to the dashboard if authenticated
  //       navigate('/dashboard');
  //     } else {
  //       // Redirect to the login page if not authenticated
  //       navigate('/');
  //     }
  //   } else {
  //     setIsLoadingUser(true);
  //   }
    
  // }, [userAuth]);

  // if (isLoadingUser) {
  //   // Show a loading state (you can replace this with a spinner or similar)
  //   return <div>Loading...</div>;
  // }

  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={!isAuthenticated ? <AuthForm /> : <Navigate to="/dashboard" />} />
      {/* <Route path="/" element={<AuthForm />} /> */}
     {/* <Route path="/dashboard" element={<AdminLayout data={<div>AdminLayout Dashboard</div>} />} /> */}
      <Route
  path="/dashboard"
  element={
    
    role === 'admin' ? (
        <AdminLayout data={<Adminanalytics/>} />
      ) : (
        <StudentLayout data={<UserAnalytics/>} />
      )
    
  }
/> 
      {/* Admin Routes */}
      {role === 'admin' && (
        <>
          <Route path="/dashboard" element={<AdminLayout data={<Adminanalytics/>} />} />
          <Route path="/AllQuiz" element={<AdminLayout data={<QuizAreaAdmin/>} />} />
          <Route path="/quiz-build" element={<QuizBuild />} />
          
          <Route path="/AssignToStudents" element={<AdminLayout data={<AssignToStudents/>} />} />
          <Route path="/AllStudents" element={<AdminLayout data={<AllStudents/>} />} />
          <Route path="/update-profile" element={<AdminLayout data={<UpdateProfile/>} />} />

        </>
      )}

      {/* Student Routes */}
      {role === 'user' && (
        <>
          <Route path="/dashboard" element={<StudentLayout data={<UserAnalytics/>} />} />
          <Route path="/TakeQuiz" element={<StudentLayout data={<QuizArea />} />} />
          <Route path="/quizStart" element={<QuizStart />} />
          <Route path="/update-profile" element={<StudentLayout data={<UpdateProfile/>} />} />
        </>
      )}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
 return (
    <ContextProvider>
       <Toaster />
      <Toaster1 />
      <MyRoutes />
      
      
       </ContextProvider>
  );
}
function MyRoutes(){
  const { userAuth,userRole,setUserRole } = useGlobalContextProvider(); 

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const user = userAuth?.user;
  const isAuthenticated = !!user;
  const role = userRole;

  useEffect(() => {
    if (userAuth !== null) {
      setIsLoadingUser(false);
    }
  }, [userAuth]);

  if (isLoadingUser) {
    return <div>Loading...</div>; // or you can show a spinner here
  }

  // useEffect(() => {
  //   console.log(userRole, 'userRole');
  //   debugger;
  //   //let userInSession = lookInSession("user");
  //   //userInSession? setUserRole(userInSession?.user?.role) : setUserRole('user');
    
  // }, [userAuth]);
  return(
      <Router>
        <AppRoutes isAuthenticated={isAuthenticated} role={role}/>
      </Router>
  )
}


export default App;
