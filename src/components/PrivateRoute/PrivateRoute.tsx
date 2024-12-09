import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
    // Add other properties as needed
  }
  
  interface CartItem {
    _id: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    countInStock: number;
    category?: string; // Make category optional
  }
  
  interface RootState {
    cart: {
      cartItems: CartItem[];
      shippingAddress: any;
      paymentMethod: string;
    };
    auth: {
      userInfo: User | null;
    };
  }
const PrivateRoute = () => {
    const {userInfo} = useSelector((state: RootState)=> state.auth)
    return userInfo ? <Outlet/> : <Navigate to='/login' replace/>
};

export default PrivateRoute