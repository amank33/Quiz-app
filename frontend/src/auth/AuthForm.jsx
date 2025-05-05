import { useState,useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import { motion } from "framer-motion";

function Form() {
    const [variant, setVariant] = useState("LOGIN");
    
    const [toggleCount, setToggleCount] = useState(0);
    const[localStorageData, setLocalStorageData] = useState({});

    const handleToggle = () => {
        console.log(variant);
        setVariant((prev) => prev === "LOGIN" ? "REGISTER" : "LOGIN");
        setToggleCount(prev => prev + 1);
    }
    // useEffect(() => {
    //     if (variant === "LOGIN") {
    //       const registeredEmail = localStorage.getItem('registeredEmail');
    //       if (registeredEmail) {
    //         setLoginData(prev => ({ ...prev, email: registeredEmail }));
    //       }
    //     }
    //   }, [variant]);

    return (
        <motion.div
                        className="min-h-screen w-full flex items-center justify-center bg-gray-50"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1 }}
                        variants={{
                          hidden: { opacity: 0, y: 100 },
                          visible: { opacity: 1, y: 0 },
                        }}
        >
            <div className="relative w-[800px] h-[500px] bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Container for sliding panels */}
                <div className="absolute inset-0 w-full h-full">
                    {/* Left panel - Forms */}
                    <div className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-500 ease-in-out
                        ${variant === "REGISTER" ? "-translate-x-full" : "translate-x-0"}`}>
                        <Login toggleCount={toggleCount} setVariant={setVariant} localStorageData={localStorageData} setLocalStorageData={setLocalStorageData}/>
                    </div>
                    <div className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-500 ease-in-out
                        ${variant === "LOGIN" ? "translate-x-full" : "translate-x-full"}`}>
                        <Register toggleCount={toggleCount} setVariant={setVariant} localStorageData={localStorageData} setLocalStorageData={setLocalStorageData}/>
                    </div>

                    {/* Right panel - Green section */}
                    <div className={`absolute top-0 right-0 w-1/2 h-full bg-emerald-500 text-white transition-transform duration-500 ease-in-out
                        ${variant === "LOGIN" ? "translate-x-0" : "-translate-x-full"}`}>
                        <div className="h-full w-full flex flex-col items-center justify-center px-8">
                            {variant==="LOGIN" ? <Common props="signup" variant={variant} handleToggle={handleToggle}/> : <Common props="signin" variant={variant} handleToggle={handleToggle}/>}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
function Common({props, variant, handleToggle}){
    return(
       props==='signup'?
       (
        <div className={`w-full text-center transition-all duration-500 ${variant === "LOGIN" ? "opacity-100" : "opacity-0"}`}>
                                <h2 className="text-2xl font-semibold mb-4">New Here!</h2>
                                <p className="mb-8">Enter your personal details and start journey with us</p>
                                <button
                                    onClick={handleToggle}
                                    className="px-10 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-emerald-500 transition-colors"
                                >
                                    Sign Up
                                </button>
                            </div>
       ):(
        <div className={`w-full text-center transition-all duration-500 ${variant === "REGISTER" ? "opacity-100" : "opacity-0"}`}>
                                <h2 className="text-2xl font-semibold mb-4">Already a member!</h2>
                                <p className="mb-8">Keep connected with us by signing in with your personal info</p>
                                <button
                                    onClick={handleToggle}
                                    className="px-10 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-emerald-500 transition-colors"
                                >
                                    Sign In
                                </button>
                            </div>
       )
        
    )
}

export default Form;