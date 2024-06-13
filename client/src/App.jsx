import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Workouts from "./pages/Workouts"
import Menu from "./components/Menu";
import PrivateRoute from "./components/PrivateRoute";
import SnackBar from "./components/SnackBar";
import { useSelector } from "react-redux";


function App() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <SnackBar />
      {currentUser ? <Menu /> : false}
      <Routes>
        {/* Rotas não privadas */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* Rotas privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Workouts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
