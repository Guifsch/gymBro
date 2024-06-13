import React, { useEffect } from "react";
import { Snackbar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { snackBarClose } from "../redux/snackbar/snackBarSlice";
import Alert from "@mui/material/Alert";
function SnackBar() {
  const dispatch = useDispatch();
  const { message, open, severity, vertical, horizontal } = useSelector(
    (state) => state.snackBar
  );

  useEffect(() => {
    if (open === true) {
      const timeoutId = setTimeout(() => {
        dispatch(snackBarClose());
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  const handleCloseSnack = (event, reason) => {
    dispatch(snackBarClose());
  };
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}

        message={message}
        key={vertical + horizontal}
        // action={
        //   <React.Fragment>
        //     <IconButton
        //       aria-label="close"
        //       color="inherit"
        //       sx={{ p: 0.5 }}
        //       onClick={handleCloseSnack}
        //     >
        //       <CloseIcon />
        //     </IconButton>
        //   </React.Fragment>
        // }
      >
        <Alert
          onClose={handleCloseSnack}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SnackBar;
