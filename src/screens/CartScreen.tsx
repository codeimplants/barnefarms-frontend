import { Button, Card, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";

interface RootState {
  cart: {
    cartItems: CartItem[];
    shippingAddress: any;
    paymentMethod: string;
  };
}

// Define types for Cart and CartItem
interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  countInStock: number;
  category?: string;
}

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select cart items from the Redux store
  const cart = useSelector((state: RootState) => state.cart);
  const { cartItems } = cart;

  // Handler to add items to cart
  const addToCartHandler = (product: CartItem, qty: number) => {
    dispatch(addToCart({ ...product, qty, category: product.category || 'defaultCategory' }));

  };

  // Handler to remove items from the cart
  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  // Handler for checkout process (requires login if not authenticated)
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item:CartItem) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>₹{item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc: number, item:CartItem) => acc + item.qty, 0)})
                items
              </h2>
              ₹
              {cartItems
                .reduce((acc: number, item:CartItem) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
