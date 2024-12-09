import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";
import { useState } from "react";
import { addToCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux";

export interface ProductType {
  _id: number;
  name: string;
  image: string;
  price: number;
  countInStock: number;
}

const ProductScreen = () => {
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    if (product) {
      dispatch(addToCart({ ...product, qty }));
      navigate("/cart");
    }
  };

  // Type guard to check if the error is a FetchBaseQueryError
  const isFetchBaseQueryError = (error: any): error is { data: { message: string } } => {
    return error?.data && typeof error.data.message === "string";
  };

  const renderError = () => {
    if (isFetchBaseQueryError(error)) {
      return <Message variant="danger">{error.data.message}</Message>;
    } else if (error instanceof Error) {
      return <Message variant="danger">{error.message}</Message>;
    }
    return <Message variant="danger">Something went wrong</Message>;
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        renderError()
      ) : (
        <Row>
          <Col md={5}>
            <Image src={product?.image} alt="vegetable image" fluid />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product?.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>Price: ₹{product?.price}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong> ₹{product?.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>

              {product.countInStock > 0 && (
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                          aria-label="Quantity"
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              )}

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
