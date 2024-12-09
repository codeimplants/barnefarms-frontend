import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
 interface AuthState {
    userInfo: {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
    } | null;
  }

   interface RootState {
    auth: AuthState;
  
  }
const AdminRoute = () => {
    const {userInfo} = useSelector((state:RootState)=> state.auth)
    return userInfo && userInfo.isAdmin? <Outlet/> : <Navigate to='/login' replace/>
};

export default AdminRoute