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
  overflow: "scroll",
};

export default function ModalWorkoutCategory({ open, handleClose, modalWorkoutCategoryRefreshRef }) {
  const axiosInterceptor = axiosConfig();
  // const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useDispatch();
  const [content, setContent] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState([]);
  const [fields, setFields] = useState([]);
  const [workoutsCategorysArray, setWorkoutsCategorysArray] = useState([]);
  const [workoutsCategorys, setWorkoutsCategorys] = useState({});

  const getWorkoutCategorys = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/workout/categorys`, {
        withCredentials: true,
      });

      if (response.data.length > 0) {
        setWorkoutsCategorys(response.data);

        setWorkoutsCategorysArray(response.data[0].categoryItems);
   
      } else {
        setWorkoutsCategorysArray([]);
      }
    } catch (e) {
      console.log(e, "erro");
    }
  }, []);

  useEffect(() => {
    getWorkoutCategorys();
  }, [getWorkoutCategorys]);

  const refreshModalRef = (e) => {
    modalWorkoutCategoryRefreshRef(e);
  };

  
  const submitCategory = async (e) => {
    setLoading(true);

    const request = { categoryItems: fields };

    try {
      const response = await axiosInterceptor.post(
        `/api/workout/categorys`,
        request,
        { withCredentials: true }
      );

      console.log(response, "response");
      dispatch(snackBarMessageSuccess("Categorias salvas"));
    } catch (e) {
      dispatch(snackBarMessageError("Arquivo inválido!"));

      console.log(e, "erro");
    }
    setLoading(false);
    getWorkoutCategorys();
    setFields([]);
    setInputValues([""]);
  };

  const udpateCategory = async (e) => {
    setLoading(true);
    const categoryItemsId = workoutsCategorys[0]._id;
    console.log(workoutsCategorys[0]._id);
    const request = { categoryItems: fields };
    try {
      const response = await axiosInterceptor.put(
        `/api/workout/updateCategory/${categoryItemsId}`,
        request,
        { withCredentials: true }
      );

      console.log(response, "response");
      dispatch(snackBarMessageSuccess("Categorias salvas"));
    } catch (e) {
      dispatch(snackBarMessageError("Arquivo inválido!"));

      console.log(e, "erro");
    }
    setLoading(false);
    getWorkoutCategorys();
    setFields([]);
    setInputValues([""]);
    refreshModalRef("refresh");
  };




  
  const deleteCategory = async (e) => {
    const categoryItemsId = workoutsCategorys[0]._id;
    console.log(categoryItemsId, "categoryItemsId");
    console.log(e, "panicat");
    try {
      const response = await axiosInterceptor.delete(
        `/api/workout/categorys/${categoryItemsId}/categoryItems/${e}`,
        { withCredentials: true }
      );
      console.log(response, "resposta");
      dispatch(snackBarMessageSuccess("Exclusão bem succedida!"));
    } catch (e) {
      console.log(e, "erro");
    }
    setLoading(false);
    getWorkoutCategorys();
    setFields([]);
    setInputValues([""]);
    // getWorkout();
  };

  const handleChange = (e, index) => {
    const newValues = [...inputValues];
    newValues[index] = e.target.value;
    setInputValues(newValues);

    const newCategoryItems = [...fields];
    newCategoryItems[index].name = e.target.value;
    setFields(newCategoryItems);
  };

  const categoryAdd = () => {
    setFields([...fields, { name: "" }]);
  };
  const categoryRemove = () => {
    setFields(fields.slice(0, -1));
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          position: "relative",
        },
      }}
    >
      <Box sx={style}>
        <IconButton
          onClick={handleClose}
          size="large"
          sx={{
            position: "absolute",
            top: "5px",
            right: "10px",
            zIndex: "999",
          }}
          aria-label="back"
          color="primary"
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>

        {loading ? (
          <Box
            sx={{
              transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              opacity: "1",
              position: "absolute",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              height: "100%",
              width: "100%",
              left: "0",
              top: "0",
              zIndex: "9999",
            }}
          >
            <CircularProgress
              sx={{
                width: "80px!important",
                height: "80px!important",
                position: "absolute",
                left: "43%",
                top: "43%",
              }}
            />
          </Box>
        ) : (
          false
        )}
        <Box
          className="boxDad"
          sx={{
            "&:hover > svg": {
              visibility: "visible",
              transition: "0.5s",
              opacity: 1,
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "50px",
            }}
          >
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button onClick={categoryAdd}>Adicionar categoria</Button>
            </Container>

            <Container
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                paddingTop: "50px",
                flexDirection: "row",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                }}
              >
                {fields.map((item, index) => (
                  <TextField
                    key={index}
                    onChange={(e) => handleChange(e, index)}
                    type="text"
                    required
                    id={`field-${index}`}
                    label="Nome"
                    variant="standard"
                    autoComplete="on"
                    sx={{
                      width: "50%",
                      marginRight: "5%",
                      marginTop: "10px",
                    }}
                    value={inputValues[index] || ""}
                  />
                ))}

                {fields.length > 0 ? (
                  <Button onClick={categoryRemove}>X</Button>
                ) : (
                  false
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                }}
              >
                {workoutsCategorysArray.map((item, index) => (
                  <Container
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      type="text"
                      required
                      variant="standard"
                      autoComplete="on"
                      sx={{
                        width: "26%",
                        marginRight: "5%",
                        marginTop: "10px",
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Button onClick={() => deleteCategory(item._id)}>
                      Deletar
                    </Button>
                  </Container>
                ))}
              </Box>
            </Container>
          </Container>

          {workoutsCategorysArray.length > 0 ? (
            <Button
              sx={{
                mt: 5,
              }}
              variant="contained"
              type="submit"
              onClick={udpateCategory}
            >
              Salvar
            </Button>
          ) : (
            <Button
              sx={{
                mt: 5,
              }}
              variant="contained"
              type="submit"
              onClick={submitCategory}
            >
              Salvar
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
