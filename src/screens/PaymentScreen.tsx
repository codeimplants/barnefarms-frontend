import { useState,useEffect } from "react"
import { Button, Col, Form } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer/FormContainer"
import CheckoutSteps from "../components/CheckoutSteps/CheckoutSteps"
import { useNavigate } from "react-router-dom"
import { savePaymentMethod } from "../slices/cartSlice"

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

 const PaymentScreen = () => {
    const [paymentMethod,setPaymentMethod] = useState("RazorPay");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state:RootState)=> state.cart)
    const {shippingAddress} = cart;
    useEffect(()=>{
        if(!shippingAddress){
            navigate('/login')
        }
    },[shippingAddress,navigate]);
    
    const submitHandler = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate("/placeorder")
    }
    return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3/>
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label as='legend'>Select Method</Form.Label>
                <Col>
                <Form.Check type="radio" className="my-2" label="RazorPay or Credit Card" id="RazorPay" name="paymentMethod" value='RazorPay' checked onChange={(e)=>setPaymentMethod(e.target.value)}>
                </Form.Check>
                </Col>
        <Button type="submit" variant="primary">Continue</Button>
           </Form.Group>
        </Form>
    </FormContainer>
  )
}

export default PaymentScreen