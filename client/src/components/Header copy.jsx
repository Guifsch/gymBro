// import React from "react";
// import {
//   signOut,
// } from "../redux/user/userSlice";
// import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axiosConfig from "../utils/axios";
// import { Button, TextField } from '@mui/material'

// function Header() {
//   const axiosInterceptor = axiosConfig();
//   const dispatch = useDispatch();
//   const { currentUser } = useSelector((state) => state.user);
//   const handleSignOut = async () => {
//     try {
//       const response = await axiosInterceptor.get("/api/auth/signout", {
//         withCredentials: true,
//       });
//       console.log(response, "RESPONSE");
//       dispatch(signOut());
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const nav = (  <div className="bg-slate-200 absolute w-full">
//   <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
//     <h1 className="font-bold">Gym Bro</h1>
//     <ul className="flex gap-4">
//       <Link to="/">
//         <li>Home</li>
//       </Link>
//       <Link to="/about">
//         <li>About</li>
//       </Link>
//       <Link to="/profile">
//         {currentUser ? (
//           <img src={currentUser.profilePicture} alt="profile-picture" className="h-7 w-7 rounded-full object-cover" />
//         ) : (
//           <li>Entrar</li>
//         )}
//       </Link>
//       <Button variant="outlined">Outlined</Button>
//       <li onClick={handleSignOut}>Sair</li>
//     </ul>
//   </div>
// </div>)
//   return (
//     <div>
//     { currentUser ? (

//    nav
//   ) : (<span></span>)}
//   </div>
//   );
// }

// export default Header;

import * as React from "react";
import axiosConfig from "../utils/axios";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { snackBarMessage } from "../redux/snackbar/snackBarSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import gymBroLogo from "../assets/icons/arm-icon.png";
import CardMedia from "@mui/material/CardMedia";
const pages = ["Products", "Pricing", "Blog"];
import Container from "@mui/material/Container";
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const axiosInterceptor = axiosConfig();
  const dispatch = useDispatch();
  let history = useNavigate();
  const handleSignOut = async () => {
    try {
      const response = await axiosInterceptor.get("/api/auth/signout", {
        withCredentials: true,
      });
      console.log(response, "RESPONSE");
      history("/sign-in");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(snackBarMessage("Desconectado com sucesso!"));
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="false">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}

          <CardMedia
            className=""
            sx={{
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              objectFit: "cover",
              mx: 2,
            }}
            component="img"
            image={gymBroLogo}
            alt="Profile img"
          />

          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Gym Bro
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          {/* <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box> */}

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              Home
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={currentUser.profilePicture} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))} */}
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">
                  <Link to="/profile">Profile</Link>
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography onClick={handleSignOut} textAlign="center">
                  Sair
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
