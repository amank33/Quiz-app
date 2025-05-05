import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const productUpdate = async (updatedData) => {
  // console.log(updatedData);
  try {
    const { data } = await axiosInstance.post(
      `${endPoints.product.update}`,
      updatedData
    );
    return data;
  } catch (error) {
    console.error("Error occurred while updating product:", error);
    throw error;
  }
};
