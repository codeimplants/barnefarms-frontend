import { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Product from "../components/Product/Product";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";
import { useGetProductsQuery } from "../slices/productsApiSlice";

// Update the type for _id to string (since MongoDB _id is typically a string)
export interface ProductType {
  _id: string;  // Changed to string, assuming MongoDB's default ObjectId format
  name: string;
  image: string;
  price: number;
  category: string;
}

const HomeScreen = () => {
  const { data: products = [], isLoading, error } = useGetProductsQuery({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product: ProductType) => product.category === selectedCategory
        );

  // Type guard to check if error is FetchBaseQueryError
  const isFetchBaseQueryError = (error: any): error is { data: { message: string }; error: string } => {
    return error && error.data && error.error;
  };

  return (
    <div className="container">
      {isLoading ? (
        <Loader />
      ) : error ? (
        isFetchBaseQueryError(error) ? (
          <Message variant="danger">{error.data.message || error.error}</Message>
        ) : (
          <Message variant="danger">An unexpected error occurred</Message>
        )
      ) : (
        <>
          <h1 className="text-center my-3">
            Fresh {selectedCategory === "All" ? "Products" : selectedCategory}
          </h1>
          {/* Category Dropdown */}
          <Row className="justify-content-center mb-4">
            <Col xs={12} sm={8} md={6} lg={4}>
              <Form.Group controlId="categorySelect">
                <Form.Label className="d-none">Filter by Category</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          {/* Product Grid */}
          <Row>
            {filteredProducts.map((product: ProductType) => (
              <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default HomeScreen;
