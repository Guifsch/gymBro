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
      if (error.response.status === 404) {
        dispatch(signOut());
      }
      if (!error.response) {
        dispatch(snackBarMessageError("Ops, ocorreu um erro, verifique sua conexão!"));
      }
      if (error.response.statusText === "Unauthorized") {
        dispatch(snackBarMessageError(error.response.data.error))
        console.log(error, "interceptor response Error");
        history("/sign-in");
        dispatch(signOut());
       
      }
      return Promise.reject(error);
    }
  );
  return axiosClient;
};

// const api = axios.create({
//   baseURL: "http://localhost:3000/",
//   timeout: 5000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add a request interceptor
// api.interceptors.request.use(function (config) {
//   // Do something before request is sent
//   console.log(config, "interceptor request Config")
//   return config;
// }, function (error) {
//   console.log(error, "interceptor request Error")
//   // Do something with request error
//   return Promise.reject(error);
// });

// api.interceptors.response.use(
//   (response) => {
//     console.log(response, "interceptor response Response")
//     return response;
//   },
//   async function (error) {
//     const dispatch = useDispatch();
//     if (
//       error.request.statusText === "Unauthorized"
//     ) {
//       console.log(error, "interceptor response Error")
//       dispatch(signOut());
//     }
//     return Promise.reject(error);
//   }
// );

// const useAxios = () => {
//   const dispatch = useDispatch();
//   const axiosClient = axios.create({
//     baseURL: "https://localhost:7131/api/",
//   });

//   axiosClient.interceptors.response.use(
//     (response) => {
//       dispatch({ type: response.config.headers.custom_loader });
//       return response;
//     },
//     (error) => {
//       dispatch({ type: error.config.headers.custom_loader });
//       return Promise.reject(error);
//     }
//   );

//   axiosClient.interceptors.request.use(
//     (config) => {
//       dispatch({ type: config.headers.custom_loader });
//       config.headers["Content-Type"] = "application/json";
//       return config;
//     },
//     (error) => {
//       Promise.reject(error);
//     }
//   );
//   return axiosClient;
// };

// // Add a response interceptor
// api.interceptors.response.use((response) => {
//   // Any status code that lie within the range of 2xx cause this function to trigger
//   // Do something with response data
//   console.log("teste2")
//   return response;
// },
// async function (error) {
//   If (error.request.statusText="Unauthorized") {
//     console.log(teste, "TESTE")

//   }
//   // Any status codes that falls outside the range of 2xx cause this function to trigger
//   // Do something with response error
//   return Promise.reject(error);
// });

// api.interceptors.request.use(function (config) {
//   if (store.state.access_token == null) {
//     return config;
//   }
//   if (typeof store.state.access_token !== "undefined") {
//     config.headers.Authorization = `Bearer ${store.state.access_token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async function (error) {
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       store.state.access_token
//     ) {
//       store.dispatch("logout");
//       router.push("/");
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosConfig;
