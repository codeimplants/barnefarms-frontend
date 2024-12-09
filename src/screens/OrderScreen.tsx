import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Message from "../components/Message/Message";
import Loader from "../components/Loader/Loader";
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetRazorPayKeyIdQuery, useDeliverOrderMutation } from "../slices/ordersApiSlice";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";

declare global {
    interface Window {
      Razorpay: any;
    }
  }

  interface OrderItem {
    name: string;
    image: string;
    product: string;
    price: number;
    qty: number;
  }

  
interface RazorPayResponse {
  razorpay_payment_id: string;
}

interface UserInfo {
  isAdmin: boolean;
}

const OrderScreen = () => {
  const { id: orderId } = useParams<{ id: string }>(); // Use proper type for URL params

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);  
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { data: razorpay } = useGetRazorPayKeyIdQuery({});
  const { userInfo } = useSelector((state: { auth: { userInfo: UserInfo } }) => state.auth);

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(order!._id).unwrap();
      await refetch(); // Ensure updated data is fetched
      toast.success("Order marked as delivered");
    } catch (err: any) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const handlePayment = () => {
    if (!order) return;
    const options = {
      key: razorpay?.keyId || "rzp_test_xdVEmJErXax2yi", // Dynamic key if fetched from backend
      amount: order.totalPrice * 100, // Amount in the smallest unit
      currency: "INR",
      name: "Test Merchant",
      description: "Payment for testing",
      handler: async function (response: RazorPayResponse) {
        try {
          // Update payment on the server
          const paymentDetails = {
            id: response.razorpay_payment_id,
            status: "success",
            update_time: new Date().toISOString(),
            payer: {
              email_address: order.user.email,
            },
          };

          await payOrder({ orderId: order._id, details: paymentDetails }).unwrap();
          refetch();
          toast.success("Payment successful and order updated!");
        } catch (error: any) {
          toast.error(error?.data?.message || error.message);
        }
      },
      prefill: {
        name: order.user.name,
        email: order.user.email,
        contact: order.shippingAddress.phoneNumber,
      },
      notes: {
        address: order.shippingAddress.address,
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return isLoading ? <Loader /> : error ? <Message variant="danger" /> : (
    <>
      <h1>OrderID: {order!._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Name: </strong> {order!.user.name}</p>
              <p><strong>Email:</strong> {order!.user.email}</p>
              <p><strong>Address: </strong>{order!.shippingAddress.address}, {order!.shippingAddress.city} {order!.shippingAddress.postalCode} {order!.shippingAddress.country}</p>
              {order!.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order!.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>
                  Not Delivered
                </Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order!.paymentMethod}
              </p>
              {order!.isPaid ? (
                <Message variant='success'>
                  Paid on {order!.paidAt}
                </Message>
              ) : (
                <Message variant='danger'>
                  Not Paid
                </Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order!.orderItems.map((item: OrderItem, index: number) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{order!.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{order!.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{order!.taxPrice}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{order!.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {loadingPay && <Loader />}
              {!order!.isPaid && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    onClick={handlePayment}
                  >
                    Pay Now
                  </Button>
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo && userInfo.isAdmin && order!.isPaid && !order!.isDelivered && (
                <ListGroup.Item>
                  <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>
                    Mark as Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
