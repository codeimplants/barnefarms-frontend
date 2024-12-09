import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import FormContainer from "../components/FormContainer/FormContainer"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {saveShippingAddress} from '../slices/cartSlice'
import CheckoutSteps from "../components/CheckoutSteps/CheckoutSteps"
interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
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
  

const ShippingScreen = () => {
    const cart = useSelector((state: RootState)=>state.cart)
    const {shippingAddress} = cart; 
    const [address,setAddress] = useState(shippingAddress?.address||'');
    const [city,setCity] = useState(shippingAddress?.city||'');
    const [postalCode,setPostalCode] = useState(shippingAddress?.postalCode||'');
    const [country,setCountry] = useState(shippingAddress?.country ||'');
    const dispatch = useDispatch();
    const navigate =useNavigate();

    const handleSubmit=(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log('submitted successfully');
        dispatch(saveShippingAddress({address,city,postalCode,country}));
        navigate('/payment');
    }
    return (
   <FormContainer>
    <CheckoutSteps step1 step2/>
    <h1>Shipping</h1>
    <Form onSubmit={handleSubmit}>
        <Form.Group controlId="address" className="my-2">
            <Form.Label>Address</Form.Label>
            <Form.Control type='text' placeholder="Enter your address" value={address} onChange={(e)=>setAddress(e.target.value)} required>
            </Form.Control> 
        </Form.Group>
        <Form.Group controlId="city" className="my-2">
            <Form.Label>City</Form.Label>
            <Form.Control type='text' placeholder="Enter your city" value={city} onChange={(e)=>setCity(e.target.value)} required>
            </Form.Control> 
        </Form.Group>
        <Form.Group controlId="postalCode" className="my-2">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control type='text' placeholder="Enter your postal code" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)}required>
            </Form.Control> 
        </Form.Group>
        <Form.Group controlId="country" className="my-2">
            <Form.Label>Country</Form.Label>
            <Form.Control type='text' placeholder="Enter your address" value={country} onChange={(e)=>setCountry(e.target.value)} required>
            </Form.Control> 
        </Form.Group>
        <Button type="submit" variant="primary" className="my-2">Continue</Button>
    </Form>
   </FormContainer>
  )
}

export default ShippingScreen