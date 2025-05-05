import { axiosInstance } from '../axiosInstance/axiosInstance'
import { endPoints } from '../endPoints/endPoints'

import { toast1 } from "src/hooks/use-toast";
import { storeInSession } from '../../common/session'

import axios from 'axios';


export const userSignIn = async (user) => {
  try {
    const { data } = await axiosInstance.post(`${endPoints.user.signin}`, user)
    return data
  } catch (error) {
    console.log(error)
  }
}

export async function getLoginData(values) {
  try {
   
    
    let baseUrl = String(import.meta.env.VITE_API_BASE_URL);
    console.log("domain");
    const response = await axios.post(`${baseUrl}/api/auth/login`, values, {
      headers: { 'Content-Type': 'application/json' },
      // withCredentials: true, // for cookies

    })
  
    const data = response.data;
    storeInSession("user", JSON.stringify(data));

    if (data.status) {
      toast1({
        title: "Login Success!",
        description: data.message,
    })
    return data;

    } else {
      toast1({
        title: 'Login Failure!',
        description: data.message || 'Something went wrong.',
        variant: 'destructive',
      });
    return false;
    }
    // axios
    //   .post(`${baseUrl}/api/auth/login` , values)
    //   .then(({ data }) => {
    //     console.log(data);
    //     storeInSession("user", JSON.stringify(data));
        
    //     toast1({
    //               title: "Login Success!",
    //               description: data.message,
    //           })
    //           return (true,data);
    //   })
    //   .catch((err) => {
    //     const { response } = err;
    //     //toast.error(response.data.error);
    //     toast1({
    //               title: "Login Failure!",
    //               description: response.data.error,
    //               variant: "destructive"
    //           })
    //           return false;
    //   });
      // const response = await fetch(`${baseUrl}/api/auth/login`, {
      //     method: 'Post',
      //     headers: { "Content-type": "application/json" },
      //     credentials: 'include',
      //     body: JSON.stringify(values)
      // })
      // const data = await response.json()
      // if (data.status) {
      //     toast1({
      //         title: "Login Success!",
      //         description: data.message,
      //     })
          
      // } else {
      //   toast1({
      //         title: "Login Failure!",
      //         description: data.message,
      //         variant: "destructive"
      //     })
      // }

  } catch (error) {
    toast1({
      title: 'Login Failure!',
      description: error?.response?.data?.message || 'Login failed due to a server error.',
      variant: 'destructive',
    });
      return false
  }
  
}
