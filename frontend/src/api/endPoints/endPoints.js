export const baseURL = 
  import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:4000";

//Access to product image
export const image = (media) => {
  return (
    `https://wtsacademy.dedicateddevelopers.us` + `/uploads/product/${media}`
  );
};

//Access to profile_pic
export const profile_pic = (media) => {
  return (
    `https://wtsacademy.dedicateddevelopers.us` +
    `/uploads/user/profile_pic/${media}`
  );
};

export const endPoints = {
  user: {
    register: "/api/auth/register",
    login: "/api/auth/login",
  },
  product: {
    create: "/product/create",
    lists: "/product/list",
    delete: "/product/remove",
    update: "/product/update",
    details: "/product/detail",
  },
  exam: {
    delete: "/api/exam/deleteExam",
  },
};
