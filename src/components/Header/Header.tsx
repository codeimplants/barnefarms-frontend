import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../../assets/logo.png";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoCartOutline } from "react-icons/io5";
import { useState } from "react";
import LoginDrawer from "../LoginDrawer/LoginDrawer";
import LoginModal from "../LoginModal/LoginModal";

// Define the types for the Redux state
interface RootState {
  cart: {
    cartItems: { qty: number }[]; // Typing the cartItems array
  };
  auth: {
    userInfo: {
      name: string;
      isAdmin: boolean;
    } | null; // User info can be null if not logged in
  };
}

const Header: React.FC = () => {
  const [loginDrawer,setLoginDrawer] = useState( false);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [loginModal,setLoginModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logoutApiCall({}).unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }; 
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const toggleDrawer = (open:boolean) => {

    setLoginDrawer(open);
  };
  
  const openModal=(open:boolean)=>{
    setLoginModal(open)
  }
  return (
    <header>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(rgb(236, 220, 255), rgb(255, 255, 255))",boxShadow: "none",paddingTop:"10px"}}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "57px",
            px: { xs: 3, md: 6 },
          }}
        >
          {/* User Icon (Mobile Only) */}
          {!isDesktop && (
     <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 0.3,
    }}
  >
    {!userInfo ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton color="inherit" onClick={()=>openModal(true)}>
            <HiOutlineUserCircle style={{ color: "black", fontSize: "2rem" }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: { xs: "0.8rem", md: "0.9rem" },
              color: "black",
            }}
          >
            Log In
          </Typography>
        </Box>
    ) : (
      <LinkContainer to="/profile">
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton color="inherit">
            <HiOutlineUserCircle style={{ color: "black", fontSize: "2rem" }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: { xs: "0.8rem", md: "0.9rem" },
              color: "black",
            }}
          >
            {userInfo.name}
          </Typography>
        </Box>
      </LinkContainer>
    )}
  </Box>
)}
          {/* Logo */}
            <Box
              sx={{
                ...(isDesktop
                  ? { marginRight: "auto" }
                  : {
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }),
                    ...(!isDesktop?{display:'none'}:{display:'block'}),
              }}
            >
              <Box
                component="a"
                href="/"
                sx={{
                  display: "block",
                  img: {
                    width: {
                      xs: "90px", // Smaller logo for mobile
                      sm: "100px",
                      md: "120px",
                    },
                    height: "auto",
                  },
                }}
              >
                <img src={logo} alt="logo" />
              </Box>
            </Box>

          {/* Right Side Icons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ...(isDesktop
                ? { gap: 2, marginLeft: "auto" }
                : { position: "absolute", right: 16 }),
            }}
          >
            {/* User Icon Desktop View*/}
            {isDesktop &&  (
              <Box>
                {!userInfo ?(
     
                   <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                     <IconButton color="inherit" onClick={()=>openModal(true)}>
                       <HiOutlineUserCircle style={{ color: "black", fontSize: "2rem" }} />
                     </IconButton>
                     <Typography
                       sx={{
                         fontSize: { xs: "0.8rem", md: "0.9rem" },
                         color: "black",
                       }}
                     >
                       Log In
                     </Typography>
                   </Box>
                ):(
                    
              <LinkContainer to="/profile">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column", // Stack icon and text
                  alignItems: "center",
                  textAlign: "center",
                  gap: 0.5, // Space between icon and text
                }}
              >
                <IconButton color="inherit" >
                  <HiOutlineUserCircle
                    style={{ color: "black", fontSize: "2rem" }}
                  />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                    color: "black",
                  }}
                >
                  {userInfo.name}
                </Typography>
              </Box>
            </LinkContainer>
                )}

              </Box>
            )}



{/* Cart */}
            {!userInfo?(
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column", // Stack icon and text
                  alignItems: "center",
                  textAlign: "center",
                  gap: 0.5, // Space between icon and text
                }}
              >
                <IconButton color="inherit"  onClick={()=> toggleDrawer(true)}>
                  <Badge
                    badgeContent={cartItems.reduce(
                      (acc, currItem) => acc + currItem.qty,
                      0
                    )}
                    invisible={cartItems.length === 0}
                    color="secondary"
                  >
                    <IoCartOutline
                      style={{
                        color: "black",
                        fontSize:'2rem'
                      }}
                    />
                  </Badge>
                </IconButton>
                <Typography
                  sx={{
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                    color: "black",
                  }}
                >
                  Cart
                </Typography>
              </Box>
            ):(
              <LinkContainer to="/cart">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column", // Stack icon and text
                  alignItems: "center",
                  textAlign: "center",
                  gap: 0.5, // Space between icon and text
                }}
              >
                <IconButton color="inherit">
                  <Badge
                    badgeContent={cartItems.reduce(
                      (acc, currItem) => acc + currItem.qty,
                      0
                    )}
                    invisible={cartItems.length === 0}
                    color="secondary"
                  >
                    <IoCartOutline
                      style={{
                        color: "black",
                        fontSize:'2rem'
                      }}
                    />
                  </Badge>
                </IconButton>
                <Typography
                  sx={{
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                    color: "black",
                  }}
                >
                  Cart
                </Typography>
              </Box>
            </LinkContainer>
            )}
            <Box>
            </Box>
          </Box>

        </Toolbar>
      </AppBar>

       {/* Drawer for Login */}
       <LoginDrawer
        openDrawer={loginDrawer}
        closeLoginDrawer={() => toggleDrawer(false)}/>

        {/* Login modal on click of login */}

        <LoginModal openModal={loginModal} closeModal={ ()=>openModal(false)}/>
    </header>
  );
};

export default Header;
