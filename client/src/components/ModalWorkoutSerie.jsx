import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import CardMedia from "@mui/material/CardMedia";
import { TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";




import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';



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
};


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ModalWorkoutSerie({ open, handleClose, workoutContent }) {
  const axiosInterceptor = axiosConfig();
  const theme = useTheme();
  const [selectedItems, setSelectedItems] = useState([]);
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log(workoutContent, "workouts cacete")
  }, [workoutContent]);



  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
  
    const selectedNames = typeof value === 'string' ? value.split(',') : value;
  
    const newSelectedItems = selectedNames.map(name => 
      workoutContent.find(item => item.name === name)
    );
    setSelectedItems(newSelectedItems);
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
      dispatch(snackBarMessageError("Arquivo inválido!"));

      console.log(e, "erro");
    }
    setLoading(false);
    setContent({ name: "", rep: "", set: "", weight: "", exercisePicture: "" });
    setImagePreview(undefined);
    getWorkoutRefValue(1);
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
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedItems.map(item => item.name)}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((name) => (
                <Chip key={name} label={name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {workoutContent.map((item) => (
            <MenuItem
              key={item._id}
              value={item.name}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </Box>
    </Modal>
  );
}
