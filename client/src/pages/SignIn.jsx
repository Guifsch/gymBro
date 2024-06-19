import React from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { snackBarMessageSuccess, snackBarMessageError } from "../redux/snackbar/snackBarSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import axiosConfig from "../utils/axios";
import Typography from "@mui/material/Typography";
import { Button, Box, TextField } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Container from "@mui/material/Container";
import CardMedia from '@mui/material/CardMedia';
import backgroundImage from '../assets/login_background_images/background-login-image.jpeg';
function Signin() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  let history = useNavigate();
  const axiosInterceptor = axiosConfig();
  // FETCH VERSION
  // const handleSubmit = async (e) => {
  //   e.preventDefault ()
  //   try {
  //     dispatch(signInStart()); //loading para true vindo do userSlice
  //     const res = await fetch('http://localhost:3000/api/auth/signin', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     })

  //     const data = await res.json()
  //     console.log(data, "data")
  //     dispatch(signInSuccess(data)); //loading, error para false e o envio do action.payload vindo do userSlice
  //     if (data.success === false) {
  //       dispatch(signInFailure()); //loading e error para false vindo do userSlice
  //       return
  //     }
  //     history("/");
  //   } catch (error) {
  //     console.log(error,"error")
  //     dispatch(signInFailure(error)); //loading e error para false vindo do userSlice
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInterceptor.post(
        "/api/auth/signin",
        formData,
        { withCredentials: true }
      );
      // const response = await axiosInterceptor.post(`/api/auth/signin`, formData)
      console.log(response.data, "resposta");
      dispatch(signInSuccess(response.data)); //loading, error para false e o envio do action.payload vindo do userSlice
      
      dispatch(snackBarMessageSuccess('Bem vindo ' + response.data.username + '!'));
      history("/");
    } catch (error) {
      console.log(error, "ERROR");
      // if (error.response.status === 404 || 401) {
      //   dispatch(snackBarMessageError(error.response.data.error));
      // }

        dispatch(snackBarMessageError(error.response.data.error));
     
   
    }
  };

  return (
    <Box  className="flex justify-center items-center h-screen bg-slate-200">
    <CardMedia
    className=""
       sx={{ width: 1, height: 1, position: 'absolute', filter: 'contrast(0.3)' }}
        component="img"
        image={backgroundImage}
        alt="Background-image"
      />
      <Box
        height={600}
        width={450}
        display="flex"
        alignItems="center"
        justifyContent="start"
        onSubmit={handleSubmit}
        flexDirection="column"
        component="form"
        sx={{ backgroundColor: "white", pt: 6, zIndex: 1, boxShadow: '5px 5px 15px 1px' }}
      >
           <Typography variant="h4" textAlign="center">
                  Bem vindo!
                </Typography>
        {/* <h1 className="text-3xl text-center font-semibold">BEM VINDO!</h1> */}
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              onChange={handleChange}
              type="email"
              required
              id="email"
              label="Email"
              variant="standard"
              autoComplete="on"
            />
          </Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <LockIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              onChange={handleChange}
              type="password"
              required
              id="password"
              label="Password"
              variant="standard"
              autoComplete="off"
            />
          </Box>
        </Container>

        <div className="flex items-center justify-center mb-5 mt-10 w-full">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
            Você não possui uma conta?
            <Link to="/sign-up" className="text-blue-500 ml-1">
              Registre-se!
            </Link>
          </div>
        </div>
        <Button    sx={{
            mb: 3, mt: 3
          }} variant="contained" type="submit">
          Entrar
        </Button>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
            ou conecte com o Google
          </div>
        <OAuth></OAuth>
      </Box>
    </Box >
  );
}

export default Signin;
