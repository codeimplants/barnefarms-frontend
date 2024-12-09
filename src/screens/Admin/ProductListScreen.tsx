import { LinkContainer } from "react-router-bootstrap";
import { Button, Table, Col, Row } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message/Message";
import Loader from "../../components/Loader/Loader";
import { useGetProductsQuery, useCreateProductMutation } from "../../slices/productsApiSlice";
import { toast } from "react-toastify";

// Define the Product type
interface Product {
  _id: string;
  name: string;
  price: number;
}

const ProductListScreen = () => {
  const { data: products, refetch, isLoading, error } = useGetProductsQuery({});
  const [createProduct, { isLoading: createLoading }] = useCreateProductMutation();

  // Define the type for the parameter 'id'
  const deleteHandler = (id: string) => {
    console.log('Deleted', id);
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure, you want to create a new product?')) {
      try {
        await createProduct({});
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm my-3" onClick={createProductHandler}>
            <FaEdit /> Create a product
          </Button>
        </Col>
      </Row>
      {createLoading && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        // Handle error by checking if it's an instance of FetchBaseQueryError or SerializedError
        <Message variant="danger">
          {error instanceof Error ? error.message : "An error occurred"}
        </Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product: Product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button className="btn-sm mx-2" variant="light">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      className="btn-sm"
                      variant="danger"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
