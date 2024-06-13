import { Button, Box, TextField } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Container from "@mui/material/Container";
import CardMedia from "@mui/material/CardMedia";
import backgroundImage from "../assets/login_background_images/background-login-image.jpeg";
import IconButton from "@mui/material/IconButton";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import React from "react";
import axiosConfig from "../utils/axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import OAuth from "../components/OAuth";
import { snackBarMessageSuccess, snackBarMessageError } from "../redux/snackbar/snackBarSlice";

function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const dispatch = useDispatch();
  let history = useNavigate();
  const axiosInterceptor = axiosConfig();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInterceptor.post(
        "/api/auth/signup",
        formData
      );
      console.log(response.data, "resposta");
      dispatch(snackBarMessageSuccess("Registrado com sucesso!"));
      history("/sign-in");
    } catch (error) {
      dispatch(snackBarMessageError(error.response.data.error));
    }
    console.log(e);
  };

  return (
    <Box  className="flex justify-center items-center h-screen bg-slate-200">
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
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => history(-1)}
          size="large"
          sx={{
            position: "absolute",
            top: "5px",
            left: "15px",
          }}
          aria-label="back"
          color="primary"
        >
          <KeyboardBackspaceIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="h4" textAlign="center">
          Registre-se!
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
              type="username"
              required
              id="username"
              label="Nome"
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
              label="Senha"
              variant="standard"
              autoComplete="off"
            />
          </Box>
        </Container>

        <Button
          sx={{
            mb: 3,
            mt: 3,
          }}
          variant="contained"
          type="submit"
        >
          Registrar
        </Button>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
          ou conecte com o Google
        </div>
        <OAuth></OAuth>
      </Box>
    </Box >

    // <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
    //   <h1 className="mb-5 text-3xl text-center font-semibold">Registrar</h1>
    //   <div className="mb-5">
    //     <label className="block mb-2 text-sm font-medium text-gray-900 ">
    //       Nome do usuário
    //     </label>
    //     <input
    //       type="username"
    //       id="username"
    //       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //       required
    //       onChange={handleChange}
    //     />
    //   </div>

    //   <div className="mb-5">
    //     <label className="block mb-2 text-sm font-medium text-gray-900 ">
    //       Seu email
    //     </label>
    //     <input
    //       type="email"
    //       id="email"
    //       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //       required
    //       onChange={handleChange}
    //     />
    //   </div>
    //   <div className="mb-5">
    //     <label className="block mb-2 text-sm font-medium text-gray-900">
    //       Sua senha
    //     </label>
    //     <input
    //       type="password"
    //       id="password"
    //       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //       required
    //       onChange={handleChange}
    //     />
    //   </div>
    //   <OAuth></OAuth>
    //   <div className="flex items-start mb-5">
    //     <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
    //       Você já possui uma conta?
    //       <Link to="/sign-in" className="text-blue-500 ml-1">
    //         Logue-se!
    //       </Link>
    //     </div>
    //   </div>
    //   <button
    //     disabled={loading}
    //     type="submit"
    //     className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //   >
    //     {loading ? "Carregando..." : "Registrar"}
    //   </button>
    //   <p className="tex-red">{error && "Algo errado aconteceu!"}</p>
    // </form>
  );
}

export default Signup;
