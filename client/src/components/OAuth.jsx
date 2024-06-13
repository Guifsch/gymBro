import React from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Button, Box, TextField } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import IconButton from "@mui/material/IconButton";
import { snackBarMessageSuccess, snackBarMessageError } from "../redux/snackbar/snackBarSlice";

function OAuth() {
  const dispatch = useDispatch();
  let history = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const googleData = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };
      const response = await axios.post(
        `http://localhost:3000/api/auth/google`,
        googleData,
        { withCredentials: true }
      );
      dispatch(signInSuccess(response.data));
      console.log(result, "RESULT");
      dispatch(snackBarMessageSuccess("Conectado com sucesso!"));
      history("/");
    } catch (error) {
      dispatch(snackBarMessageError("Oops, algo deu errado!"));
    }
  };

  return (
      <div>
        <IconButton
          onClick={handleGoogleClick}
          aria-label="delete"
          size="small"
        >
          <GoogleIcon sx={{color: "#DB4437"}}  fontSize="small" />
        </IconButton>
        {/* <Button onClick={handleGoogleClick} variant="contained">Continue com o Google</Button> */}
        {/* <button onClick={handleGoogleClick} type="button" className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full w-100 px-5 py-2.5 text-center dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-800 transition ease-in-out delay-50"
      >
        Continue com o Google
      </button> */}
      </div>
  );
}

export default OAuth;
