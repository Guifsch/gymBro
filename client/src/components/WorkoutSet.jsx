
import ModalWorkoutSet from "./ModalWorkoutSet";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";
import { Container, Box, Typography, Button  } from "@mui/material";
import Loading from "./Loading";
import { useDispatch } from "react-redux";
import React, { useCallback, useState, useEffect } from "react";
import axiosConfig from "../utils/axios";

export default function Workouts() {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  const [openSerieModal, setOpenSerieModal] = React.useState(false);
  const [modalContentUpdate, setModalContentUpdate] = useState({
    name: "",
    comment: "",
    selectedItems: [],
  });
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const getSets = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/set/sets`, {
        withCredentials: true,
      });
      setSets(response.data);

    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    }
  }, []);

  const deleteSet = async (e) => {
    try {
      const response = await axiosInterceptor.delete(
        `/api/set/delete/${e._id}`,
        { withCredentials: true }
      );
      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));
    }
    getSets();
  };

  // useEffect para buscar os exercícios quando o componente é montado
  useEffect(() => {
    getSets();
  }, [getSets]);

  const modalSetRefreshRef = () => {
    getSets();
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
          paddingLeft: "18%",
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
