import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
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
  Drawer,
  Button,
  Container,
  Modal,
  TextField,
  InputAdornment
} from "@mui/material";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoCartOutline } from "react-icons/io5";
import { useState } from "react";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import  bg from '../../assets/bg.svg'
import { IoMdCloseCircle } from "react-icons/io";
import { Widgets } from "@mui/icons-material";
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
  const [loginModal,setLoginModal] = useState(false)
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [phoneInput,setPhoneInput] = useState(false);
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

  const isMobile = useMediaQuery("(max-width:600px)");
  const toggleDrawer = (open:boolean) => {

    setLoginDrawer(open);
  };
  const handleOpenLoginModal = () => setLoginModal(true);
  const handleCloseLoginModal = () => setLoginModal(false);

    const style={
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: isMobile ? "100%" : "600px",
      minHeight: isMobile?"100vh": "40vh",
      padding: "2rem",
      color: "white",
      boxShadow: 24,
      borderRadius: isMobile ? 0 : "25px",
      backgroundImage: `url(${bg})`, // Background image
      backgroundSize: 'cover', 
      bgcolor: 'background.paper',
      overflow: "hidden",
      
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
      <LinkContainer to="/login">
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
            Log In
          </Typography>
        </Box>
      </LinkContainer>
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
                   <LinkContainer to="/login">
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
                       Log In
                     </Typography>
                   </Box>
                 </LinkContainer>
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
       <Drawer
        anchor="right"
        open={loginDrawer}
        onClose={() => toggleDrawer(false)}
      >
        <Box
          sx={{
            width: {xs:'400px'},
          }}
        >
           <AppBar position="static" sx={{backgroundColor:'white'}} elevation={1}>
        <Toolbar variant="dense" >
          <IconButton edge="start" onClick={() => toggleDrawer(false)}>
            <NavigateBeforeIcon sx={{color:'black'}}/>
          </IconButton>
          <Typography variant="h6" sx={{color:'black',fontFamily:"Montserrat",fontSize:"1.1rem"}} >
            Cart
          </Typography>
        </Toolbar>
      </AppBar>
          <Box sx={{backgroundColor:'#F0F4F9',padding:'2px',paddingTop:{sm:40,xs:20,md:20},  height: { lg: '94vh', sm: '96vh', xs: '81.5vh' },overflow:'hidden'}}>
            <Box sx={{ backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '1rem',
      width: { xs: '100%', sm: '70%', md: '100%' }, // Make the inner box responsive
      maxHeight: '80vh', // Prevent it from growing too large
      overflowY: 'auto', // Add vertical scroll only if content exceeds height
      borderRadius: '8px',}}>
              <Typography variant="h6" sx={{fontFamily:"Inter",fontWeight:'700'}}> 
                    Please Login
              </Typography>
              <Typography variant="h6" sx={{fontFamily:"Inter",fontSize:'0.8rem',fontWeight:'600',marginBottom:'1rem',padding:'0.7rem'}}>
                    Please login to access the cart.
              </Typography>
              <Button variant="contained" sx={{backgroundColor:"#EF4372",padding:'0.7rem',fontFamily:"Inter",borderRadius:2}} disableElevation fullWidth onClick={handleOpenLoginModal}>Login</Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
      <Modal open={loginModal} onClose={handleCloseLoginModal} aria-labelledby="mobile-modal" aria-describedby="responsive-modal">
      <Box sx={style}>
        {isMobile?(
        <Box sx={{position:'relative',mt:2,left:'93%'}}>
        <IconButton onClick={handleCloseLoginModal}>
          <IoMdCloseCircle  style={{color:"#9d67aa",fontSize:'1.2rem',marginLeft:10}} />
        </IconButton>
        </Box>

        ):""}
        <Typography
          sx={{
            fontFamily: "Lato",
            fontWeight: "700",
            backgroundImage:"linear-gradient(180deg, #ff3269 9%, #ff794d 98.18%)",
            color: 'transparent',
          backgroundClip: 'text',
            fontSize:{lg: "3rem",xs:"2.5rem"},
            mb: 2,

          }}
        >
          barne farms
        </Typography>

        {/* Heading */}
        <Typography
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "700",
            fontSize: "1.8rem",
            mb: 3,
            width:{xs:"90px",sm:"320px",},
            letterSpacing:'1.5px'
          }}
        >
          Groceries delivered in  10 minutes
        </Typography>

       <Box sx={{display:'flex',
            justifyContent:"center",
            alignItems:'center',flexDirection:'column'}}>

        <TextField
          placeholder="Enter Phone Number"
          variant="outlined"
          fullWidth
          
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: "black", fontWeight: "bold" }}>
                +91
              </InputAdornment>
            ),
            sx: {
              borderRadius: "50px",
              backgroundColor: "white",
              height: "45px",
              border: "none",
            },
          }}
          inputProps={{
            maxLength: 10,
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            mb: 3,
            width:{lg:"75%",xs:"100%",sm:"80%"}
          }}
          onChange={()=>setPhoneInput(true)}
        />
        <Button
          fullWidth
          disabled={phoneInput}
   
          sx={{
            backgroundImage:"linear-gradient(92.16deg, #ff3269 1.82%, #ff794d 98.18%)",
            color: "white",
            borderRadius: "50px",
            height: "50px",
            textTransform: "none",
            "&:disabled": { backgroundColor: "black" },
            fontFamily:"Montserrat",
            width:{lg:"75%",xs:"100%",sm:"80%"}
          }}
        >
          Continue
        </Button>
        <Typography
          sx={{
            
            textAlign: "center",
            fontSize: "0.8rem",
            mt: 3,
            width:"230px",
            fontFamily:"Inter"
          }}
        >
          By continuing, you agree to our{" "}
          <span style={{ color: "#FF5C5C", fontWeight: "bold" }}>Terms of Service</span> &{" "}
          <span style={{ color: "#FF5C5C", fontWeight: "bold" }}>Privacy Policy</span>
        </Typography>
       </Box>

        {/* Continue Button */}

        {/* Terms and Policy */}
      </Box>
    </Modal>
    </header>
  );
};

export default Header;
