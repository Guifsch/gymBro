import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { useSelector } from "react-redux";
// import { useState } from "react";
import { Box } from "@mui/material";

function Loading() {
//   const [teste, setTeste] = useState(true);
  const { loading } = useSelector((state) => state.loading);

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        zIndex: 1,
        top: "64px",
      }}
    >
      {loading  ? <LinearProgress sx={{}} /> : false}
    </Box>
  );
}

export default Loading;
