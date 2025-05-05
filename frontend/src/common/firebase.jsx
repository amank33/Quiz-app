// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { GoogleAuthProvider, getAuth } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCqO4M0y7deHQgZpvCwyDnps9mVQ-q7yhs",
//   authDomain: "react-js-blogging-websit-f41e9.firebaseapp.com",
//   projectId: "react-js-blogging-websit-f41e9",
//   storageBucket: "react-js-blogging-websit-f41e9.appspot.com",
//   messagingSenderId: "95797118471",
//   appId: "1:95797118471:web:621574776aaffddf528ca2",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// //google auth

// const provider = new GoogleAuthProvider();
// const auth = getAuth();

// export const authWithGoogle = async () => {
//   let user = null;
//   await signInWithPopup(auth, provider)
//     .then((result) => {
//       user = result.user;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   return user;
// };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf4UHVS2ctrMdgWCiQENS_2E8467Pb14k",
  authDomain: "workout-project-88ceb.firebaseapp.com",
  projectId: "workout-project-88ceb",
  storageBucket: "workout-project-88ceb.appspot.com",
  messagingSenderId: "64243880894",
  appId: "1:64243880894:web:91c5ad4310f935dd5b9fef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//google auth

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      user = result.user;
    })
    .catch((error) => {
      console.log(error);
    });

  return user;
};
