import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Drawer,
  Button,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useState } from "react";
import LoginModal from "../LoginModal/LoginModal";

interface LoginDrawerProps {
  openDrawer: boolean;
  closeLoginDrawer: () => void;
}

const LoginDrawer: React.FC<LoginDrawerProps> = ({
  openDrawer,
  closeLoginDrawer,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };
  return (
    <Drawer open={openDrawer} onClose={() => closeLoginDrawer()} anchor="right">
      <Box
        sx={{
          width: { xs: "400px" },
        }}
      >
        <AppBar
          position="static"
          sx={{ backgroundColor: "white" }}
          elevation={1}
        >
          <Toolbar variant="dense">
            <IconButton edge="start" onClick={closeLoginDrawer}>
              <NavigateBeforeIcon sx={{ color: "black" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                color: "black",
                fontFamily: "Montserrat",
                fontSize: "1.1rem",
              }}
            >
              Cart
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            backgroundColor: "#F0F4F9",
            padding: "2px",
            paddingTop: { sm: 20, xs: 20, md: 20 },
            height: { lg: "94vh", sm: "96vh", xs: "95vh" },
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "1rem",
              width: { xs: "100%", sm: "100%", md: "100%" }, 
              maxHeight: "80vh",  
              overflowY: "auto",
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontFamily: "Inter", fontWeight: "700" }}
            >
              Please Login
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Inter",
                fontSize: "0.8rem",
                fontWeight: "600",
                marginBottom: "1rem",
                padding: "0.7rem",
              }}
            >
              Please login to access the cart.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#EF4372",
                padding: "0.7rem",
                fontFamily: "Inter",
                borderRadius: 2,
              }}
              disableElevation
              fullWidth
              onClick={handleModal}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>
      <LoginModal closeModal={closeModal} openModal={openModal} />
    </Drawer>
  );
};
export default LoginDrawer;
