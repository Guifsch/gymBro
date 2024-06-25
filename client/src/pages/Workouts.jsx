import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import ModalWorkout from "../components/ModalWorkout";
import Tab from "@mui/material/Tab";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import WorkoutSerie from "../components/WorkoutSerie";
import Button from "@mui/material/Button";
import React, { useCallback, useState, useEffect } from "react";
import axiosConfig from "../utils/axios";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";
import { snackBarMessageSuccess } from "../redux/snackbar/snackBarSlice";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../firebase";
import { Box, Container } from "@mui/material";
import ModalWorkoutCategory from "../components/ModalWorkoutCategory";

export default function Workouts() {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  const [valueTab, setValueTab] = React.useState("1");
  const [modalWorkoutCategoryRefreshRef, setModalWorkoutCategoryRefreshRef] =
    React.useState("1");
  const [openWorkoutModal, setOpenWorkoutModal] = React.useState(false);
  const [openCategoryModal, setOpenCategoryModal] = React.useState(false);
  const [categoryInputClean, setCategoryInputClean] = React.useState(1);
  const [imageTableShow, setImageTableShow] = useState(undefined);
  const [modalContentUpdate, setModalContentUpdate] = useState({
    name: "",
    rep: "",
    set: "",
    weight: "",
    category: "",
    exercisePicture: "",
    comment: "",
  });
  const [workouts, setWorkouts] = useState([]);
  const [getWorkoutRefUpdate, setGetWorkoutRefUpdate] = useState([]);

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
    } catch (e) {
      console.log(e, "erro");
    }
  }, []);

  const getWorkoutRef = useCallback(async (e) => {
    setGetWorkoutRefUpdate(e);
    console.log("pagina atualizada", e);
  }, []);

  const refreshModalRef = useCallback(async (e) => {
    setModalWorkoutCategoryRefreshRef(e);

    console.log("TESTEEEE", e);
  }, []);

  useEffect(() => {
    getWorkoutRef();
    getWorkout();
  }, [getWorkout, getWorkoutRefUpdate]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nome",
        size: 150,
      },
      {
        accessorKey: "rep",
        header: "Repetições",
        size: 150,
      },
      {
        accessorKey: "set",
        header: "Sets",
        size: 150,
      },
      {
        accessorKey: "weight",
        header: "Peso",
        size: 150,
      },
      {
        accessorKey: "category",
        header: "Categoria",
        size: 150,
        Cell: ({ row }) => {
          // Função de renderização personalizada para a célula
          const categories = row.original.category; // Acessa a propriedade 'category' do objeto original da linha
          if (Array.isArray(categories)) {
            // Verifica se 'category' é um array
            const categoryNames = categories.map((cat) => cat.name).join(", "); // Mapeia os objetos do array para obter os nomes e junta em uma string separada por vírgulas
            return <span>{categoryNames}</span>; // Retorna os nomes das categorias como conteúdo da célula
          }
          return null; // Retorna null se 'category' não for um array, ou você pode colocar um valor padrão aqui
        },
      },

      {
        accessorKey: "exercisePicture",
        header: "Imagem",
        size: 150,
        Cell: ({ row }) => (
          <Box
            onClick={() => handleShowImage(row.original.exercisePicture)}
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
          </Box>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: workouts,
  });

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
    setImageTableShow(e);
    setOpenWorkoutModal(true);
  };

  const handleOpenWorkoutModal = () => {
    setOpenWorkoutModal(true);
  };

  const handleCloseWorkoutModal = (e) => {
    setCategoryInputClean((prevCount) => prevCount + 1);
    setModalContentUpdate({
      name: "",
      rep: "",
      set: "",
      weight: "",
      category: "",
      comment: "",
      exercisePicture: "",
    });
    setOpenWorkoutModal(false);
    setImageTableShow(undefined);
  };

  const handleOpenCategoryModal = (e) => {
    setOpenCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false);
  };

  const handleOpenUpdate = (e) => {
    console.log(e, "HEHE");
    setModalContentUpdate(e);
    setOpenWorkoutModal(true);
  };

  return (
    <Box className="flex flex-col justify-initial items-center pageMarginTopNavFix">
      <Loading />
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginTop: 5 }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Registrar Exercícios" value="1" />
            <Tab label="Registrar Treinos" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                mt: 0,
                mb: "25px",
                mr: "20px",
              }}
              onClick={handleOpenWorkoutModal}
            >
              <Typography variant="h7" textAlign="center">
                Enviar Treino
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={{
                mt: 0,
                mb: "25px",
                ml: "20px",
              }}
              onClick={handleOpenCategoryModal}
            >
              <Typography variant="h7" textAlign="center">
                Criar categorias
              </Typography>
            </Button>
          </Container>
          <Box sx={{ pb: 10, width: "100%" }}>
            <MaterialReactTable table={table} />
          </Box>
        </TabPanel>
        <TabPanel value="2">
          <WorkoutSerie />
        </TabPanel>
      </TabContext>
      <ModalWorkoutCategory
        open={openCategoryModal}
        handleClose={handleCloseCategoryModal}
        getWorkoutRef={getWorkoutRef}
        modalWorkoutCategoryRefreshRef={refreshModalRef}
      />
      <ModalWorkout
        open={openWorkoutModal}
        handleClose={handleCloseWorkoutModal}
        getWorkoutRef={getWorkoutRef}
        modalContentUpdate={modalContentUpdate}
        modalImageShow={imageTableShow}
        refreshModalRef={modalWorkoutCategoryRefreshRef}
        categoryInputClean={categoryInputClean}
      />
    </Box>
  );
}
