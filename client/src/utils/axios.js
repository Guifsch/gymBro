import axios from "axios";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { snackBarMessageSuccess, snackBarMessageError } from "../redux/snackbar/snackBarSlice";

const axiosConfig = () => {
  let history = useNavigate();
  const dispatch = useDispatch();
  const axiosClient = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // const axiosClient = axios.create({
  //   baseURL: "http://192.168.15.7:3000/",
  //   timeout: 5000,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

 axiosClient.interceptors.request.use(
    (config) => {
      console.log(config, "interceptor response Response");
      return config;
    },
    (error) => {
      console.log(error)
      Promise.reject(error);
    }
  );
  axiosClient.interceptors.response.use(
    (response) => {
      console.log(response, "interceptor request Config");
      return response;
    },
    (error) => {
    
      if (!error.response) {
        console.log(error)
        dispatch(snackBarMessageError("Ops, ocorreu um erro, verifique sua conexão!"));
        dispatch(signOut());
      }
      else if (error.response.statusText === "Unauthorized" || error.response.statusText === "Not Found") {
        dispatch(snackBarMessageError(error.response.data.error))
        console.log(error, "interceptor response Error");
        history("/sign-in");
        dispatch(signOut());
       
      }
      console.log(error, "interceptor request Error")
      return Promise.reject(error);
    }
  );
  return axiosClient;
};

export default axiosConfig;
