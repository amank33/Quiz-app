import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const getSingleProduct = async (id) => {
  try {
    const { data } = await axiosInstance.get(
      `${endPoints?.product?.details}/${id}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
