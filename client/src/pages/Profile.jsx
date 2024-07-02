import { React, useRef, useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosConfig from "../utils/axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  deleteUserSuccess,
  updateUserSuccess,
  signOut,
} from "../redux/user/userSlice";
import { snackBarMessageSuccess } from "../redux/snackbar/snackBarSlice";
import { loadingTrue, loadingFalse } from "../redux/loading/loadingSlice";
import { Button, TextField, Box } from "@mui/material";
import LogoAvatarStandard from "../assets/icons/logo_standard.jpg";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CardMedia from "@mui/material/CardMedia";
import CreateIcon from "@mui/icons-material/Create";
import Loading from "../components/Loading";
import CircularProgress from "@mui/material/CircularProgress";
// --FIREBASE STORAGE--
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { app } from "../firebase";

function Profile() {
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  // --FIREBASE STORAGE--
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePercent, setImagePercent] = useState(0);
  const [downloadedURL, setDownloadedURL] = useState({});
  const [imageError, setImageError] = useState(false);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const { currentUser } = useSelector((state) => state.user);

  const getUserProfile = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(
        `/api/user/user/${currentUser._id}`,
        { withCredentials: true }
      );
      setFormData(response.data);
      console.log(currentUser._id, "PROFILE");
    } catch (e) {
      console.log(e, "erro");
    }
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const profileImage = async (e) => {
    const image = e.target.files[0];

    setImage(image);
    let fileReader;
    if (image) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result) {
          setImagePreviewImage(result);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loadingTrue());
    try {
      let updatedFormData = { ...formData };

      if (imagePreview) {
        await removeImageFirebase(formData.profilePicture);
        const imageUrl = await handleFileUpload(image);
        updatedFormData = { ...updatedFormData, profilePicture: imageUrl };
        console.log(imageUrl, "imageUrl");
      }

      const response = await axiosInterceptor.post(
        `/api/user/update/${currentUser._id}`,
        updatedFormData,
        { withCredentials: true }
      );
      dispatch(updateUserSuccess(response.data));
      dispatch(snackBarMessageSuccess("Atualização completa"));
      setImagePreviewImage(null);
    } catch (e) {
      setImageError(true);
      console.log(e, "erro");
    }
    getUserProfile();
    dispatch(loadingFalse());
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      await removeImageFirebase(formData.profilePicture);
      const response = await axiosInterceptor.delete(
        `/api/user/delete/${currentUser._id}`,
        { withCredentials: true }
      );
      console.log(response, "resposta");
      dispatch(deleteUserSuccess(response.data)); //loading, error para false e o envio do action.payload vindo do userSlice
    } catch (e) {
      console.log(e, "erro");
    }
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
    <Box className="flex justify-center items-center h-screen">
      <Loading />
      <Box
        height={600}
        width={450}
        display="flex"
        alignItems="center"
        justifyContent="start"
        onSubmit={handleSubmit}
        flexDirection="column"
        component="form"
        sx={{
          backgroundColor: "white",
          zIndex: 1,
          boxShadow: "5px 5px 15px 1px",
          position: "relative",
          pt: 5,
          borderRadius: "2%",
        }}
      >
        <Typography variant="h4" textAlign="center" sx={{ mb: 3 }}>
          PERFIL
        </Typography>

        <Box
          sx={{
            position: "relative",
          }}
        >
          <Box
            className="boxDad"
            onClick={() => fileRef.current.click()}
            sx={{
              "&:hover > svg": {
                visibility: "visible",
                transition: "0.5s",
                opacity: 1,
              },
            }}
          >
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={(e) => profileImage(e)}
            />
            <CardMedia
              component="img"
              sx={{
                objectFit: "cover",
                cursor: "pointer",
                height: "100px",
                transition: "0.5s",
                width: "100px",
                borderRadius: "50%",
                "&:hover": {
                  filter: "contrast(0.3)",
                  transition: "0.5s",
                },
              }}
              image={imagePreview || formData.profilePicture}
            ></CardMedia>
            <CreateIcon
              sx={{
                position: "absolute",
                top: "40%",
                left: "40%",
                transition: "0.5s",
                visibility: "hidden",
                opacity: 0,
                cursor: "pointer",
                color: "#fff",
              }}
            />
          </Box>
        </Box>
        <p className="text-sm self-center">
          {imageError ? ( // Porcentagem do progresso do upload e mensagens de erro
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>

        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              onChange={handleChange}
              value={formData.username}
              type="username"
              required
              id="username"
              label="Nome"
              variant="standard"
              autoComplete="on"
            />
          </Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              onChange={handleChange}
              value={formData.email}
              type="email"
              required
              id="email"
              label="Email"
              variant="standard"
              autoComplete="on"
            />
          </Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <LockIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              onChange={handleChange}
              type="password"
              id="password"
              label="Senha"
              variant="standard"
              autoComplete="off"
            />
          </Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-evenly",
            mt: 3,
          }}
        >
          <Button
            sx={{
              mb: 3,
              mt: 3,
            }}
            variant="contained"
            type="submit"
          >
            Atualizar
          </Button>
          <Button
            sx={{
              mb: 3,
              mt: 3,
            }}
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
          >
            Excluir
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default Profile;
