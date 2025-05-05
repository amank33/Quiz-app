import { axiosInstance } from '../axiosInstance/axiosInstance'
import { endPoints } from '../endPoints/endPoints'

import { toast1 } from "src/hooks/use-toast";
import { storeInSession } from '../../common/session'
import useGlobalContextProvider from '../../hooks/ContextApi';
import axios from 'axios';


// export const userSignUp = async (newUser) => {
//   console.log(newUser)

//   try {
//     const { data } = await axiosInstance.post(
//       `${endPoints.user.singup}`,
//       newUser
//     )
//     return data
//   } catch (error) {
//     console.log(error)
//   }
// }

export const userAuthThroughServer = (serverRoute, formData) => {
  //axios.post(process.env.VITE_SERVER_DOMAIN);
  console.log(import.meta.env.VITE_SERVER_DOMAIN);
  console.log("domain");
  axios
    .post("http://localhost:4000" + endPoints.user.singup, formData)
    .then(({ data }) => {
      console.log(data);
      storeInSession("user", JSON.stringify(data));
      setUserAuth(data);
    })
    .catch((err) => {
      const { response } = err;
      toast.error(response.data.error);
    });
};

export async function getRegisterData(values) {
  try {
    debugger;
    console.log(values)
    let baseUrl = String(import.meta.env.VITE_API_BASE_URL);
    const response = await axios.post(`${baseUrl}/api/auth/register`, values, {
      headers: { 'Content-Type': 'application/json' }
    })
  
    const data = response.data
  
    
  
    if (data.status) {
      toast1({
        title: 'Registration Success!',
        description: data.message,
      })
      return true;
    } else {
      toast1({
        title: 'Registration Faliure!',
        description: data.message,
        variant: 'destructive'
      })
      return false;
    }
  } catch (error) {
    toast1({
      title: 'Error!',
      description: error.response.data.message,
      variant: 'destructive'
    })
    return false;
  }
}
