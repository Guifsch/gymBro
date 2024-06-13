import React, { useEffect} from "react";
import { useSelector } from "react-redux";
//Outlet mostra os componentes filhos / Navigate diferente do useNavigate que redireciona, é na verdade um componente que também redireciona
import { Outlet, Navigate } from "react-router-dom";
import { snackBarMessageSuccess, snackBarMessageError } from "../redux/snackbar/snackBarSlice";
import { useDispatch } from "react-redux";

function PraviteRoute() {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    if (!currentUser) {
      dispatch(snackBarMessageError("Você não está autentificado!"));
    }
  }, [currentUser]);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PraviteRoute;
