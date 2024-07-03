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
import ModalWorkoutSet from "../components/ModalWorkoutSet";
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
import { Container, Paper } from "@mui/material";
import Loading from "../components/Loading";
import { useSelector, useDispatch } from "react-redux";
import React, { useCallback, useState, useEffect } from "react";
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
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





  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  const onDragEnd = result => {
    const { destination, source } = result;
    if (!destination) return;

    const destDate = destination.droppableId;
    setItems(prevItems => {
      const newItems = { ...prevItems };
      if (!newItems[destDate]) {
        newItems[destDate] = [];
      }
      newItems[destDate].push(source.index);
      return newItems;
    });
  };







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

  const handleCloseSerieModal = () => {
    setModalContentUpdate({ name: "", comment: "", selectedItems: [] });
    setOpenSerieModal(false);
  };














  
  return (
    <Box className="flex flex-col justify-initial items-center pageMarginTopNavFix">
      <Loading />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "initial",
          width: "100%",
          marginTop: '40px'
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: 'center',
            flexWrap: "wrap",

            flexDirection: "column",
            width: "25%",
          }}
        >
          {sets.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                borderRadius: "5%",
                width: "250px",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "column",
                border: "solid 1px",
                marginTop: "5%",
                marginBottom: "5%",
                wordBreak: "break-word",
                cursor: "pointer",
              }}
            >
              <Container
                onClick={() => handleOpenSerieModalUpdate(item)}
                sx={{
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
        <Box
        sx={{width: '65%', display: 'flex'}}
        >
          teste
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
