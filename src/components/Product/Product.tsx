import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import { ProductType } from "../../screens/HomeScreeen";

interface ProductProps {
    product: ProductType;
}

const Product: React.FC<ProductProps> = ({product}) => {
  
  return (
    <Card className="my-4 p-3 rounded mx-4">
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant="top"/>
        </Link>
        <Card.Body>
            <Link to={`/product/${product._id}`}>
                <Card.Title as="div">
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>
            <Card.Text as="h3">₹{product.price}</Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Product