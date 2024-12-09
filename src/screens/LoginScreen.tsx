import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Row, Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

// Define User interface
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

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await login({ email, password });
      console.log('Login response data:', data);

      if (data) {
        // Update Redux store with user info (including token)
        dispatch(setCredentials(data));  // Make sure this action works correctly
        localStorage.setItem('userInfo', JSON.stringify(data));
      } else {
        toast.error('Invalid Credentials');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
          Sign In
        </Button>
        {isLoading && <Loader />}
      </Form>
      <Row className="py-3">
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
