import Backdrop from "@mui/material/Backdrop";
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, CssBaseline } from "@mui/material";

import Tab from "@mui/material/Tab";
import { TabContext, TabPanel, TabList } from "@mui/lab";

import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";

import { TextField } from "@mui/material";
import React, { useCallback, useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import LinearProgress from "@mui/material/LinearProgress";
import CardMedia from "@mui/material/CardMedia";
import axiosConfig from "../utils/axios";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { Edit, Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "../components/Loading";
import { useSelector, useDispatch } from "react-redux";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  deleteUserSuccess,
  updateUserSuccess,
  signOut,
} from "../redux/user/userSlice";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "../firebase";
import { Box } from "@mui/material";
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

export default function Workouts() {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  const [valueTab, setValueTab] = React.useState("1");
  const [open, setOpen] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openShowImage, setOpenShowImage] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [image, setImage] = useState(undefined);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageTableShow, setImageTableShow] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [content, setContent] = useState({});
  const [modalContentUpdate, setModalContentUpdate] = useState({});
  const [workouts, setWorkouts] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const getWorkout = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/workout/workouts`, {
        withCredentials: true,
      });
      setWorkouts(response.data.workouts);
      console.log(response.data.workouts, "workouts");
      setImagePreview(undefined);
    } catch (e) {
      setImageError(true);
      console.log(e, "erro");
    }
  }, []);

  useEffect(() => {
    getWorkout();
  }, [getWorkout]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name", //access nested data with dot notation
        header: "Nome",
        size: 150,
      },
      {
        accessorKey: "rep",
        header: "Repetições",
        size: 150,
      },
      {
        accessorKey: "set", //normal accessorKey
        header: "Sets",
        size: 150,
      },
      {
        accessorKey: "weight",
        header: "Peso",
        size: 150,
      },

      {
        accessorKey: "exercisePicture",
        header: "Imagem",
        size: 150,
        Cell: ({ row }) => (
          <Box
            onClick={() => handleShowImage(row.original)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "0.2s",
              "&:hover": {
                filter: "contrast(0.5)",
                transition: "0.2s",
              },
            }}
          >
            <img
              alt="avatar"
              height={30}
              src={row.original.exercisePicture}
              loading="lazy"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
            {/* {row.original.exercisePicture === null || undefined ? (
              <img
                alt="avatar"
                height={30}
                src={row.original.exercisePicture}
                loading="lazy"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            ) : (
              <Skeleton variant="rectangular" width={100} height={100}>
                Imagem não encontrada
              </Skeleton>
            )} */}

            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
          </Box>
        ),
      },
      {
        header: "Ações",
        enableColumnActions: false,
        size: 50,
        Cell: ({ row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "initial",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <IconButton
              sx={{ borderRadius: 0 }}
              onClick={() => handleOpenUpdate(row.original)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              sx={{ borderRadius: 0 }}
              onClick={() => handleDeleteExercisePicture(row.original)}
            >
              <DeleteIcon />
            </IconButton>
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
          </Box>
        ),
      },
    ],
    []
  );

  // const handleEdit =(e) => {
  // console.log(e, "samubomba")
  // }
  const table = useMaterialReactTable({
    columns,
    data: workouts,
    // enableRowActions: true,
    // positionActionsColumn: 'last',
    // renderRowActions: ({ row }) => (
    //   <Box>
    //     <IconButton onClick={() => console.info('Edit')}>
    //       <EditIcon />
    //     </IconButton>
    //     <IconButton onClick={() => console.info('Delete')}>
    //       <DeleteIcon />
    //     </IconButton>
    //   </Box>
    // ),
  });

  const handleChange = (e) => {
    setContent({ ...content, [e.target.id]: e.target.value });
    console.log(content, "CONTENT");
  };

  const handleChangeUpdate = (e) => {
    console.log(modalContentUpdate, "CONTENT");
    setModalContentUpdate({
      ...modalContentUpdate,
      [e.target.id]: e.target.value,
    });
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
      // const newDirectory = currentUser.username;
      const fileName = new Date().getTime() + image.name;
      // const storageRef = ref(storage, `${newDirectory}/${fileName}`);
      const storageRef = ref(storage, fileName);

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
    e.preventDefault();
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
      dispatch(updateUserSuccess(response.data));
      dispatch(snackBarMessageSuccess("Treino salvo"));
      setImagePreview(undefined);
      getWorkout();
    } catch (e) {
      dispatch(snackBarMessageError("Arquivo inválido!"));

      console.log(e, "erro");
    }
    setLoading(false);
    setImagePreview(undefined);
  };

  const updateWorkout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let workoutUpdated = { ...modalContentUpdate };

      if (imagePreview) {
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
      setImagePreview(undefined);
    } catch (e) {
      dispatch(snackBarMessageError("Arquivo inválido!"));
    }
    getWorkout();
    setLoading(false);
  };

  const handleDeleteExercisePicture = async (e) => {
    dispatch(loadingTrue());
    console.log(e, "gustavo");

    try {
      await removeImageFirebase(e.exercisePicture);
      const response = await axiosInterceptor.delete(
        `/api/workout/workouts/${e._id}`,
        { withCredentials: true }
      );
      console.log(response, "resposta");
      dispatch(snackBarMessageSuccess("Exclusão bem succedida!"));
    } catch (e) {
      console.log(e, "erro");
    }
    getWorkout();
    dispatch(loadingFalse());
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

  const handleShowImage = (e) => {
    setImageTableShow(e.exercisePicture);
    setOpenShowImage(true);
  };
  const handleCloseShowImage = () => {
    setImagePreview(null);
    setOpenShowImage(false);
  };

  const handleOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    setImagePreview(null);
    setOpen(false);
  };

  const handleOpenUpdate = (e) => {
    setModalContentUpdate(e);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setImagePreview(null);
    setOpenUpdate(false);
  };

  return (
    <Box className="flex flex-col justify-initial items-center pageMarginTopNavFix">
      <Loading />
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Registrar Exercícios" value="1" />
            <Tab label="Registrar Treinos" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Button
            variant="contained"
            sx={{
              my: 5,
            }}
            onClick={handleOpen}
          >
            <Typography variant="h7" textAlign="center">
              Enviar Treino
            </Typography>
          </Button>
          <Container sx={{ pb: 10 }}>
            <MaterialReactTable table={table} />
          </Container>
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
      </TabContext>

      {/* Modal Submit */}
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
        <Fade in={open}>
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
            <Box
              sx={{
                position: "relative",
                height: "100%",
                width: "100%",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    transition:
                      "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
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
                component="form"
                onSubmit={submitWorkout}
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
                    label="Nome"
                    variant="standard"
                    autoComplete="on"
                    sx={{
                      width: "40%",
                      marginRight: "5%",
                    }}
                  />
                  <TextField
                    onChange={handleChange}
                    type="rep"
                    required
                    id="rep"
                    label="Repetições"
                    variant="standard"
                    autoComplete="on"
                    sx={{
                      width: "40%",
                      marginRight: "5%",
                    }}
                  />
                  <TextField
                    onChange={handleChange}
                    type="set"
                    required
                    id="set"
                    label="Sets"
                    variant="standard"
                    autoComplete="on"
                    sx={{
                      width: "40%",
                      marginRight: "5%",
                    }}
                  />
                  <TextField
                    onChange={handleChange}
                    type="weight"
                    required
                    id="weight"
                    label="Peso"
                    variant="standard"
                    autoComplete="on"
                    sx={{
                      width: "40%",
                      marginRight: "5%",
                    }}
                  />
                </Container>
                <Button
                  sx={{
                    mt: 5,
                  }}
                  variant="contained"
                  type="submit"
                >
                  Salvar
                </Button>
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
                  {imagePreview ? (
                    <CardMedia
                      component="img"
                      sx={{
                        objectFit: "cover",
                        mt: 5,
                        height: "300px",
                        width: "450px",
                      }}
                      image={imagePreview}
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
                      Selecione sua imagem
                    </Typography>
                  )}
                </Container>
                <Container
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-evenly",
                    mt: 3,
                  }}
                ></Container>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* <Button
        variant="contained"
        sx={{
          my: 5,
        }}
        onClick={handleOpen}
      >
        <Typography variant="h7" textAlign="center">
          Enviar Treino
        </Typography>
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {workouts.length > 0 ? (
          workouts.map((picture, index) => (
            <Box
              onClick={() => handleOpenUpdate(picture)}
              key={index}
              sx={{
                backgroundColor: "white",
              }}
            >
              <Container
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="h8" textAlign="center">
                  <b>Nome:</b> {picture.name}
                </Typography>
                <Typography variant="h8" textAlign="center">
                  <b>Repetições:</b> {picture.rep}
                </Typography>
                <Typography variant="h8" textAlign="center">
                  <b>Sets:</b> {picture.set}
                </Typography>
                <Typography variant="h8" textAlign="center">
                  <b>Peso:</b> {picture.weight}
                </Typography>
              </Container>
              <CardMedia
                component="img"
                sx={{
                  objectFit: "cover",
                  height: "250px",
                  width: "300px",
                }}
                image={picture.exercisePicture}
              />
              <Button
                variant="contained"
                onClick={() => handleDeleteExercisePicture(picture)}
              >
                Excluir
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant="h5">Nenhuma treino registrado</Typography>
        )}
      </Box> */}

      {/* Modal Edit */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openUpdate}
        onClose={handleCloseUpdate}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            position: "relative",
          },
        }}
      >
        <Fade in={openUpdate}>
          <Box sx={style}>
            <IconButton
              onClick={handleCloseUpdate}
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
            <Box
              sx={{
                position: "relative",
                height: "100%",
                width: "100%",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    transition:
                      "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
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
                component="form"
                onSubmit={updateWorkout}
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
                    onChange={handleChangeUpdate}
                    value={modalContentUpdate.name}
                    type="name"
                    required
                    id="name"
                    label="Nome"
                    variant="standard"
                    autoComplete="on"
                    sx={{
                      width: "40%",
                      marginRight: "5%",
                    }}
                  />
                  <TextField
                    onChange={handleChangeUpdate}
                    value={modalContentUpdate.rep}
                    type="rep"
                    required
                    id="rep"
                    label="Repetições"
                    variant="standard"
                    autoComplete="on"
                    sx={{
                      width: "40%",
                      marginRight: "5%",
                    }}
                  />
                  <TextField
                    onChange={handleChangeUpdate}
                    value={modalContentUpdate.set}
                    type="set"
                    required
                    id="set"
                    label="Sets"
                    variant="standard"
                    autoComplete="on"
                    sx={{
                      width: "40%",
                      marginRight: "5%",
                    }}
                  />
                  <TextField
                    onChange={handleChangeUpdate}
                    value={modalContentUpdate.weight}
                    type="weight"
                    required
                    id="weight"
                    label="Peso"
                    variant="standard"
                    autoComplete="on"
                    sx={{
                      width: "40%",
                      marginRight: "5%",
                    }}
                  />
                </Container>
                <Button
                  sx={{
                    mt: 5,
                  }}
                  variant="contained"
                  type="submit"
                >
                  Salvar
                </Button>
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
                    accept="image/*"
                    placeholder="Type some text"
                    onChange={(e) => {
                      profileImage(e);
                    }}
                  />

                  {imagePreview == null ? (
                    <CardMedia
                      component="img"
                      sx={{
                        objectFit: "cover",
                        mt: 5,
                        height: "300px",
                        width: "450px",
                      }}
                      image={modalContentUpdate.exercisePicture}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      sx={{
                        objectFit: "cover",
                        mt: 5,
                        height: "300px",
                        width: "450px",
                      }}
                      image={imagePreview}
                    />
                  )}
                </Container>
                <Container
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-evenly",
                    mt: 3,
                  }}
                ></Container>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Modal Preview */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openShowImage}
        onClose={handleCloseShowImage}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            position: "relative",
          },
        }}
      >
        <Fade in={openShowImage}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "700px",
              height: "100%",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
            }}
          >
            <IconButton
              onClick={handleCloseShowImage}
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                width: "100%",
                justifyContent: "center",
                position: "relative",
              }}
            >
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      objectFit: "contain",
                      maxHeight: "400px",
                      maxWidth: "450px",
                      height: "100%",
                      width: "100%",
                    }}
                    image={imageTableShow}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
