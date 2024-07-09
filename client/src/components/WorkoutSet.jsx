import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import CardMedia from "@mui/material/CardMedia";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ModalWorkoutSet from "./ModalWorkoutSet";
import { useTheme } from "@mui/material/styles";
import { Chip, ListSubheader, Checkbox, ListItemText } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  deleteUserSuccess,
  updateUserSuccess,
  signOut,
} from "../redux/user/userSlice";
import { Container } from "@mui/material";
import Loading from "./Loading";
import { useSelector, useDispatch } from "react-redux";
import React, { useCallback, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { app } from "../firebase";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import axiosConfig from "../utils/axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

function getStyles(name, selectedItems, theme) {
  return {
    fontWeight:
      selectedItems.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    backgroundColor:
      selectedItems.indexOf(name) === -1
        ? "inherit"
        : theme.palette.action.selected,
  };
}

export default function Workouts() {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  const [valueTab, setValueTab] = React.useState("1");
  const [modalWorkoutCategoryRefreshRef, setModalWorkoutCategoryRefreshRef] =
    React.useState("1");
  const [openWorkoutModal, setOpenWorkoutModal] = React.useState(false);
  const [openSerieModal, setOpenSerieModal] = React.useState(false);
  const [categoryInputClean, setCategoryInputClean] = React.useState(1);
  const [imageTableShow, setImageTableShow] = useState(undefined);
  const [modalContentUpdate, setModalContentUpdate] = useState({
    name: "",
    comment: "",
    selectedItems: [],
  });
  const [sets, setSets] = useState([]);
  const [getWorkoutRefUpdate, setGetWorkoutRefUpdate] = useState([]);
  const theme = useTheme(); // Hook do tema do Material-UI para usar estilos do tema
  const [selectedItems, setSelectedItems] = useState([]); // Estado para armazenar os itens selecionados
  const [groupedWorkouts, setGroupedWorkouts] = useState({}); // Estado para armazenar os exercícios agrupados por categorias

  const getSets = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/set/sets`, {
        withCredentials: true,
      });
      setSets(response.data);

      console.log(response, "responseresponseresponseresponseresponse");
    } catch (e) {
      console.log(e, "erro");
    }
  }, []);

  const deleteSet = async (e) => {
    try {
      const response = await axiosInterceptor.delete(
        `/api/set/delete/${e._id}`,
        { withCredentials: true }
      );
      console.log(response, "delete response");
      dispatch(snackBarMessageSuccess("Exclusão bem succedida!"));
    } catch (e) {
      console.log(e, "erro");
    }
    getSets();
  };

  // useEffect para buscar os exercícios quando o componente é montado
  useEffect(() => {
    getSets();
  }, [getSets]);

  useEffect(() => {
    console.log(selectedItems, "selectedItems");
  }, [selectedItems]);

  const modalSetRefreshRef = () => {
    getSets();
    console.log("leitura");
  };

  const handleOpenSerieModalUpdate = (e) => {
    setModalContentUpdate(e);
    setOpenSerieModal(true);
  };

  const handleOpenSerieModal = (e) => {
    setOpenSerieModal(true);
  };

  const handleCloseSerieModal = () => {
    setModalContentUpdate({ name: "", comment: "", selectedItems: [] });
    setOpenSerieModal(false);
  };

  return (
    <Box className="flex flex-col justify-initial items-center">
      <Loading />
      <Button variant="contained" onClick={handleOpenSerieModal}>
        <Typography variant="h7" textAlign="center">
          Enviar Set
        </Typography>
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "13%",
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {sets.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                borderRadius: "5%",
                width: "22%",
                alignItems: "center",
                justifyContent: "start",
                flexDirection: "column",

                margin: "2%",
                wordBreak: "break-word",
                cursor: "pointer",
              }}
            >
              <Button
                sx={{ marginTop: "10px" }}
                onClick={() => deleteSet(item)}
              >
                Deletar
              </Button>
              <Container
                onClick={() => handleOpenSerieModalUpdate(item)}
                sx={{
                  border: "solid 1px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  flexDirection: "column",
                  wordBreak: "break-word",
                  cursor: "pointer",
                }}
              >
                <Typography
                  type="text"
                  required
                  variant="h5"
                  autoComplete="on"
                  marginTop="10px"
                  sx={{ fontWeight: "bold" }}
                >
                  {item.name}
                </Typography>
                <Typography
                  type="text"
                  required
                  variant="standard"
                  autoComplete="on"
                  marginY="10px"
                >
                  {item.comment}
                </Typography>
              </Container>
            </Box>
          ))}
        </Box>
      </Box>
      <ModalWorkoutSet
        openSerieModal={openSerieModal}
        handleCloseSerieModal={handleCloseSerieModal}
        modalContentUpdate={modalContentUpdate}
        modalSetRefreshRef={modalSetRefreshRef}
      />
    </Box>
  );
}
