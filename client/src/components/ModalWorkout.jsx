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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 246.47,
    },
  },
};

const style = {
  position: "absolute",
  top: "50%",
  borderRadius: "2%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  height: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

export default function ModalWorkout({
  open,
  handleClose,
  getWorkoutRef,
  modalContentUpdate,
  modalImageShow,
  refreshModalRefCategory,
  categoryInputClean,
}) {
  const axiosInterceptor = axiosConfig();
  // const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useDispatch();
  const [content, setContent] = useState({
    name: "",
    rep: "",
    serie: "",
    weight: "",
    exercisePicture: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(undefined);
  const [workoutsCategorys, setWorkoutsCategorys] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    try {
      if (modalContentUpdate.category && modalContentUpdate.category.length > 0)
        setSelectedOption(modalContentUpdate.category[0]._id);
    } catch (e) {
      console.log(e);
    }
    setContent(modalContentUpdate);
  }, [modalContentUpdate]);

  useEffect(() => {
    try {
      setSelectedOption(null);
    } catch (e) {
      console.log(e);
    }
    console.log(categoryInputClean, "categoryInputClean");
  }, [categoryInputClean]);

  const getWorkoutCategorys = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/category/categorys`, {
        withCredentials: true,
      });

      if (response.data.length > 0) {
        setWorkoutsCategorys(response.data[0].categoryItems);
      } else {
        setWorkoutsCategorys([]);
      }
    } catch (e) {
      console.log(e, "erro");
    }
  }, []);

  useEffect(() => {
    getWorkoutCategorys();
    console.log(refreshModalRefCategory, "refresh CATEGORYYYY");
    console.log(workoutsCategorys, "refresh workoutsCategorys");
  }, [refreshModalRefCategory, getWorkoutCategorys]);

  const getWorkoutRefValue = () => {
    getWorkoutRef((prevCount) => prevCount + 1);
  };

  const handleChange = (e) => {
    setContent({ ...content, [e.target.id]: e.target.value });
    console.log(content, "CONTENT");
  };

  const handleChangeCategory = (event) => {
    const selectedId = event.target.value;
    setSelectedOption(selectedId);

    // Verificar se selectedId não é uma string vazia
    if (selectedId !== "") {
      // Encontrar o objeto correspondente ao selectedId no array de workoutsCategorys
      const selectedOptionObject = workoutsCategorys.find(
        (option) => option._id === selectedId
      );
      console.log(selectedOptionObject, "selectedOptionObject");

      // Verificar se selectedOptionObject foi encontrado
      if (selectedOptionObject) {
        // Atualizar o conteúdo com a nova selectedOption e category
        setContent((prevContent) => ({
          ...prevContent,
          selectedOption: selectedOptionObject,
          category: selectedOptionObject,
        }));
      } else {
        // Caso selectedOptionObject não seja encontrado, limpar o conteúdo relacionado à opção selecionada
        setContent((prevContent) => ({
          ...prevContent,
          selectedOption: null, // Limpa selectedOption
          category: "", // Limpa category
        }));
      }
    } else {
      // Caso selecionado "Nenhum", limpar o conteúdo relacionado à opção selecionada
      setContent((prevContent) => ({
        ...prevContent,
        selectedOption: null, // Limpa selectedOption
        category: "", // Limpa category
      }));
    }
  };
  const profileImage = async (e) => {
    const image = e.target.files[0];

    setImage(image);
    let fileReader;
    if (image) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result) {
          setImagePreview(result);
        }
      };
      fileReader.readAsDataURL(image);
    }
  };

  const handleFileUpload = async (image) => {
    try {
      const storage = getStorage(app);
      console.log(storage, "STORAGE");
      const newDirectory = currentUser.username;
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, `${newDirectory}/${fileName}`);
      // const storageRef = ref(storage, fileName);

      const uploadTaskPromise = (fileRef, file) => {
        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(fileRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => {
              reject(error);
            },
            () => {
              resolve(uploadTask.snapshot.ref);
            }
          );
        });
      };

      const fileRef = await uploadTaskPromise(storageRef, image);
      const downloadURL = await getDownloadURL(fileRef);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const submitWorkout = async (e) => {
    setLoading(true);
    try {
      let updatedContent = { ...content };

      if (imagePreview) {
        const imageUrl = await handleFileUpload(image);
        console.log(imageUrl, "imageUrl");
        updatedContent = { ...updatedContent, exercisePicture: imageUrl };
      }

      const response = await axiosInterceptor.post(
        `/api/workout/workouts`,
        updatedContent,
        { withCredentials: true }
      );
      console.log(response, "response");
      dispatch(snackBarMessageSuccess("Treino salvo"));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));

      console.log(e, "erro");
    }
    setLoading(false);
    setContent({
      name: "",
      rep: "",
      serie: "",
      weight: "",
      exercisePicture: "",
      comment: "",
    });
    setSelectedOption(null);
    setImagePreview(undefined);
    getWorkoutRefValue();
  };

  const submitWorkoutUpdate = async () => {
    setLoading(true);
    try {
      let workoutUpdated = { ...content };
      if (imagePreview) {
        await removeImageFirebase(modalContentUpdate.exercisePicture);
        console.log(content.profilePicture, "content.profilePicture");
        const imageUrl = await handleFileUpload(image);
        workoutUpdated = { ...workoutUpdated, exercisePicture: imageUrl };
        console.log(imageUrl, "imageUrl");
      }

      const response = await axiosInterceptor.post(
        `/api/workout/update/${workoutUpdated._id}`,
        workoutUpdated,
        { withCredentials: true }
      );
      console.log(response, "updateworkoutresponse");
      dispatch(snackBarMessageSuccess("Atualização completa"));
      setContent(response.data);
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    }
    getWorkoutRefValue();
    setLoading(false);
    setImagePreview(undefined);
  };

  const removeImageFirebase = async (img) => {
    try {
      const storage = getStorage(app);
      const imageRef = ref(storage, img);
      deleteObject(imageRef);
    } catch (e) {
      console.log(e);
    }
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

        {modalImageShow ? (
          false
        ) : (
          <Typography
            textAlign="center"
            sx={{
              position: "absolute",
              right: "40%",
              left: "40%",
              top: "5px",
              fontSize: "0.8em",
              color: "red",
            }}
          >
            campos com * são obrigatórios...
          </Typography>
        )}

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
        {modalImageShow ? (
          // Modal Show
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                objectFit: "contain",
                maxHeight: "700px",
                maxWidth: "700px",
                height: "100%",
                width: "100%",
              }}
              image={modalImageShow}
            />
          </Box>
        ) : (
          // Modal Sent or Update
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
                flexWrap: "wrap",
                justifyContent: "space-around",
                paddingTop: "50px",
              }}
            >
              <TextField
                onChange={handleChange}
                type="name"
                required
                id="name"
                value={content.name}
                label="Nome"
                variant="standard"
                autoComplete="on"
                sx={{
                  "& input": {
                    borderBottom: "2px solid black",
                  },
                  width: "26%",
                  marginRight: "5%",
                }}
              />
              <TextField
                onChange={handleChange}
                type="rep"
                value={content.rep}
                required
                id="rep"
                label="Repetições"
                variant="standard"
                autoComplete="on"
                sx={{
                  "& input": {
                    borderBottom: "2px solid black",
                  },
                  width: "26%",
                  marginRight: "5%",
                }}
              />
              <TextField
                onChange={handleChange}
                type="serie"
                required
                id="serie"
                value={content.serie}
                label="Series"
                variant="standard"
                autoComplete="on"
                sx={{
                  "& input": {
                    borderBottom: "2px solid black",
                  },
                  width: "26%",
                  marginRight: "5%",
                }}
              />
              <TextField
                onChange={handleChange}
                type="weight"
                required
                id="weight"
                label="Peso"
                value={content.weight}
                variant="standard"
                autoComplete="on"
                sx={{
                  "& input": {
                    borderBottom: "2px solid black",
                  },
                  width: "26%",
                  marginRight: "5%",
                  marginTop: "3%",
                }}
              />
              <Box
                sx={{
                  width: "26%",
                  marginRight: "5%",
                  marginTop: "3%",
                }}
              >
                <Box sx={{ minWidth: 80, width: "100%" }}>
                  <InputLabel
                    sx={{ fontSize: "1rem" }}
                    id="demo-simple-select-autowidth-label"
                  >
                    Categoria*
                  </InputLabel>

                  <Select
                    sx={{
                      borderBottom: "2px solid black",
                      width: "100%",
                    }}
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={selectedOption || ""}
                    onChange={handleChangeCategory}
                    variant="filled"
                    autoWidth
                    label="Selecione uma opção"
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="">
                      <em>Nenhum</em>
                    </MenuItem>
                    {workoutsCategorys.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
              <TextField
                id="comment"
                label="Comentário"
                multiline
                type="comment"
                value={content.comment}
                onChange={handleChange}
                maxRows={4}
                sx={{
                  "& > div": { height: "100px" },
                  width: "26%",
                  marginTop: "3%",
                  marginRight: "5%",
                }}
              />
            </Container>
            {/* Button Sent or Update */}
            {Object.values(modalContentUpdate).every(
              (value) => value === ""
            ) ? (
              <Button
                sx={{
                  mt: 5,
                }}
                variant="contained"
                type="submit"
                onClick={submitWorkout}
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
                onClick={submitWorkoutUpdate}
              >
                Atualizar
              </Button>
            )}

            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                my: 5,
              }}
            >
              <input
                type="file"
                accept="image/png, image/jpeg"
                placeholder="Type some text"
                onChange={(e) => profileImage(e)}
              />
              {imagePreview || content.exercisePicture ? (
                <CardMedia
                  component="img"
                  sx={{
                    objectFit: "cover",
                    mt: 5,
                    height: "300px",
                    width: "450px",
                  }}
                  image={imagePreview || content.exercisePicture}
                />
              ) : (
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    my: 5,
                  }}
                  variant="h5"
                >
                  Selecione sua imagem*
                </Typography>
              )}
            </Container>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
