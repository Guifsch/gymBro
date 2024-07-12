import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import OAuth from "../components/OAuth";
import axiosConfig from "../utils/axios";
import {
  Button,
  Box,
  TextField,
  Typography,
  Container,
  CardMedia,
} from "@mui/material";

import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";

import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import backgroundImage from "../assets/login_background_images/background-login-image.jpeg";
function Signin() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  let history = useNavigate();
  const axiosInterceptor = axiosConfig();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loadingTrue());

    try {
      const response = await axiosInterceptor.post(
        "/api/auth/signin",
        formData,
        { withCredentials: true }
      );
      dispatch(signInSuccess(response.data)); //loading, error para false e o envio do action.payload vindo do userSlice
      dispatch(
        snackBarMessageSuccess("Bem vindo " + response.data.username + "!")
      );
      history("/");
    } catch (error) {
      dispatch(snackBarMessageError(error.response.data.error));
    }
    dispatch(loadingFalse());
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-slate-200">
      <Loading top="0"/>
      <CardMedia
        className=""
        sx={{
          width: 1,
          height: 1,
          position: "absolute",
          filter: "contrast(0.3)",
        }}
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
        sx={{
          backgroundColor: "white",
          pt: 6,
          zIndex: 1,
          boxShadow: "5px 5px 15px 1px",
          borderRadius: "5%",
        }}
      >
        <Typography variant="h4" textAlign="center">
          Bem vindo!
        </Typography>
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
        <Button
          sx={{
            mb: 3,
            mt: 3,
          }}
          variant="contained"
          type="submit"
        >
          Entrar
        </Button>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
          ou conecte com o Google
        </div>
        <OAuth></OAuth>
      </Box>
    </Box>
  );
}

export default Signin;
