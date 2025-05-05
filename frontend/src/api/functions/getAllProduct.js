import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const getAllProduct = async() =>{
 try {
  const {data} = await axiosInstance.post(`${endPoints?.product?.lists}`)
  return data
 } catch (error) {
  console.log(error);
  
 }
}