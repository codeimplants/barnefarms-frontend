import { Box, IconButton, Input, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ProductType } from "../../screens/HomeScreen";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../slices/cartSlice"; // assuming you have a cartSlice
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

// Define the props
interface ProductProps {
  product: ProductType;
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

const Product: React.FC<ProductProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1); // Start with 0 quantity
  const [isAddedToCart, setIsAddedToCart] = useState(false); // Track if the user clicked "Add to Cart"
  
  const cartItems = useSelector((state) => state.cart.cartItems);
  
  const handleIncrement = () => {
    if (quantity < 6) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      dispatch(addToCart({ ...product, qty: newQuantity, category: product.category || 'defaultCategory' }));
    }
  };

  // Handle decrement
  const handleDecrement = (id: string) => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      dispatch(addToCart({ ...product, qty: newQuantity, category: product.category || 'defaultCategory' }));
    } else {
      setIsAddedToCart(false);
      dispatch(removeFromCart(id));
    }
  };

  // Handle add to cart
  const handleAddToCart = (product: CartItem, qty: number,) => {
    setIsAddedToCart(true);
    dispatch(addToCart({ ...product, qty, category: product.category || 'defaultCategory' }));
  };

  useEffect(() => {
    const existingItem = cartItems.find((item) => item._id === product._id);
    if (existingItem) {
      setQuantity(existingItem.qty);
      setIsAddedToCart(true);
    }
  }, [cartItems, product._id]);
  return (
    // <Card sx={{ my: 4, p: 3, borderRadius: 2, boxShadow: 3 }}>
    //   {/* Image with box shadow */}
    //   <Link to={`/product/${product._id}`}>
    //     <CardMedia component="img" image={product.image} alt={product.name} sx={{height:'50px',width:'50px'}}/>
    //   </Link>

    //   <CardContent>
    //     <Link to={`/product/${product._id}`}>
    //       <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
    //         {product.name}
    //       </Typography>
    //     </Link>

    //     <Typography variant="h5" component="div" sx={{ mt: 1 }}>
    //       ₹{product.price}
    //     </Typography>

    //     {/* Quantity Selector with plus and minus buttons */}
    //     <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
    //       {isAddedToCart ? (
    //         <>
    //           {/* Decrement button */}
    //           <IconButton onClick={handleDecrement} disabled={quantity === 0}>
    //             <RemoveIcon />
    //           </IconButton>

    //           {/* Display current quantity */}
    //           <TextField
    //             value={quantity}
    //             onChange={(e) => {
    //               const newQuantity = Math.max(0, Math.min(6, parseInt(e.target.value)));
    //               setQuantity(newQuantity);
    //             }}
    //             inputProps={{ min: 0, max: 6, style: { textAlign: 'center' } }}
    //             variant="outlined"
    //             size="small"
    //             sx={{ width: 60, mx: 1 }}
    //           />

    //           {/* Increment button */}
    //           <IconButton onClick={handleIncrement} disabled={quantity === 6}>
    //             <AddIcon />
    //           </IconButton>
    //         </>
    //       ) : (
    //         // Add to Cart Button when not clicked yet
    //         <Button
    //           variant="contained"
    //           color="primary"
    //           onClick={handleAddToCart}
    //           sx={{ width: "100%" }}
    //         >
    //           Add to Cart
    //         </Button>
    //       )}
    //     </Box>
    //   </CardContent>
    // </Card>
    <Card
      sx={{
        maxWidth: 350,
      }}
      elevation={0}
    >
   <Link to={`/product/${product._id}`} >
      <CardMedia
        component="img"
        alt={product.name}
        image={product.image}
        style={{ width: "170px", height: "180px" }}
        sx={{transform:'30',":hover":{scale:1.1,transition: "0.5s"},}}
      />
      </Link>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          ₹{product.price}
        </Typography>
      </CardContent>
      
      <Box sx={{ border: "1px solid #EF4372", padding: "10px 34px",width:'55%' }}>
        {isAddedToCart ? (
          <Box sx={{height:'3vh'}}>
            <IconButton onClick={()=>handleDecrement(product._id)} disabled={quantity === 0} sx={{position:'relative',right:"3px"}}>
              <RemoveIcon sx={{color:"#EF4372",fontSize:'0.9rem',}}/>
            </IconButton>
            <Input
              type="number"
              value={quantity}
              readOnly
              onChange={(e) => {
                setQuantity(Number(e.target.value))
              }}
              inputProps={{ min: 0, max: 6, style: { textAlign: "center",color:"#EF4372",fontSize:'0.9rem', } }}
              // InputProps={{ disableUnderline: true }}
              size="small"
              sx={{ width:20, mx: 1 ,}}

            />
             
            <IconButton onClick={handleIncrement} disabled={quantity === 6} > 
             <AddIcon sx={{color:"#EF4372",fontSize:'0.9rem'}}/>
             
            </IconButton>

          </Box>
        ) : (
          <>
            <Box onClick={()=>{handleAddToCart(product,quantity)}} sx={{cursor:'pointer'}}>
              <Typography variant="body1" sx={{ fontSize: "14px",}}>
                Add to Cart
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Card>
  );
};

export default Product;
