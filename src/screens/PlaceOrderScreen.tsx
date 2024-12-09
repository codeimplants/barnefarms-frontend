import { useEffect } from "react";
import { Button, Card, Col, ListGroup, Row, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps/CheckoutSteps";
import { toast } from "react-toastify";
import Message from "../components/Message/Message";
import Loader from "../components/Loader/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import { SerializedError } from "@reduxjs/toolkit";

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
  category?: string;
}

interface RootState {
  cart: {
    cartItems: CartItem[];
    shippingAddress: any;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
  };
  auth: {
    userInfo: User | null;
  };
}

const PlaceOrderScreen = () => {
  const isFetchBaseQueryError = (error: any): error is { data: { message: string } } => {
    return error?.data && typeof error.data.message === "string";
  };

  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      // Ensure all prices are calculated correctly
      const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  
      // Ensure shippingPrice is a number and provide default if undefined
      const shippingPrice = typeof cart.shippingPrice === "number"? cart.shippingPrice : 5;
      
      // Calculate taxPrice (18% tax rate)
      const taxPrice = 0.18 * itemsPrice; // Assuming 18% tax rate
      
      // Calculate total price
      const totalPrice = itemsPrice + shippingPrice + taxPrice;
  
      // Ensure all values are formatted to two decimal places
      const formattedItemsPrice = parseFloat(itemsPrice.toFixed(2));
      const formattedShippingPrice = parseFloat(shippingPrice.toFixed(2));
      const formattedTaxPrice = parseFloat(taxPrice.toFixed(2));
      const formattedTotalPrice = parseFloat(totalPrice.toFixed(2));
  
      // Create the order
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: formattedItemsPrice,
        shippingPrice: formattedShippingPrice,
        taxPrice: formattedTaxPrice,
        totalPrice: formattedTotalPrice,
      }).unwrap();
  
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      // Custom type guard to narrow down the error type
      if (isFetchBaseQueryError(err)) {
        // Handle FetchBaseQueryError case
        toast.error(err.data?.message || 'Something went wrong with the fetch request');
      } else if (err instanceof Error) {
        // This checks if err is a standard Error object
        toast.error(err.message);
      } else {
        // Default error message for unknown errors
        toast.error("An unknown error occurred");
      }
    }
  };
  
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Payment Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>
                  Your cart is Empty <Link to="/">Go back</Link>
                </Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item: CartItem, index: number) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items: </Col>
                  <Col>₹{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping: </Col>
                  <Col>₹{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax: </Col>
                  <Col>₹{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col>₹{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {/* Handle error rendering */}
                {error && (
                  <Message variant="danger">
                    {isFetchBaseQueryError(error)
                      ? error.data?.message : (error as SerializedError).message}
                  </Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
