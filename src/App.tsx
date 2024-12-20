import { Container } from "react-bootstrap"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css'
import { useEffect } from "react";
import { BACKEND_URL } from "./constants";
import axios from "axios";
const App = () => {
  useEffect(() => {
    const fetchSessionId = async ()=>{
      try{
        let existingSessionId = sessionStorage.getItem("sessionId");
        if(!existingSessionId){
          const response = await axios.get(`${BACKEND_URL}`);
          const {sessionId,sessionExpiryTime} = response.data;
          if(sessionId){
            sessionStorage.setItem("sessionId",sessionId);
            sessionStorage.setItem("sessionExpiryTime",sessionExpiryTime);

            console.log(`Session id is ${sessionId} and session expiry time ${sessionExpiryTime}`)
          }else{
            console.error(`Failed to fetch session id from backend`);
          }
        }else{
          console.log('User session id already exists');
        }
      }catch(error){
        console.error("Something went wrong",error)
      }
      
    }
  
    fetchSessionId();
  
    return () => {
      console.log("Cleaning up session data");
      // sessionStorage.removeItem('sessionId');
      // sessionStorage.removeItem('sessionExpiry');
    };
  }, []);
  return (
    <>
    
    <Header/>
    <main className="py-3">
      <Container>
      <Outlet/>
      </Container>
    </main>
    <Footer />
    <ToastContainer/>
    </>
  )
}

export default App