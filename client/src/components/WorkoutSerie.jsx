import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import ModalWorkoutSerie from "./ModalWorkoutSerie";
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
import { Box } from "@mui/material";

export default function Workouts() {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  const [valueTab, setValueTab] = React.useState("1");
  const [open, setOpen] = React.useState(false);
  const [imageTableShow, setImageTableShow] = useState(undefined);

  const [workouts, setWorkouts] = useState([]);

  const getWorkout = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/workout/workouts`, {
        withCredentials: true,
      });
      setWorkouts(response.data.workouts);
      console.log(response.data.workouts, "workouts");
      setImagePreview(undefined);
    } catch (e) {
      console.log(e, "erro");
    }
  }, []);


  // useEffect(() => {
  //   getWorkout();
  // }, [getWorkout]);

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

  const handleOpen = (e) => {
    getWorkout()
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className="flex flex-col justify-initial items-center pageMarginTopNavFix">
      <Loading />
          <Button
            variant="contained"
            sx={{
              mt: 0,
              mb: '25px'
            }}
            onClick={handleOpen}
          >
            <Typography variant="h7" textAlign="center">
              Enviar Treino
            </Typography>
          </Button>
          <Box sx={{ pb: 10, width: "100%" }}>
            <MaterialReactTable table={table}
             />
          </Box>

      <ModalWorkoutSerie
        open={open}
        handleClose={handleClose}
        workoutContent={workouts} />
    </Box>
  );
}
