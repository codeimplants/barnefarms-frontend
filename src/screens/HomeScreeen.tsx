import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product/Product";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { Box, Tabs, Tab, Typography,  } from "@mui/material";
import { useSelector } from "react-redux";
import Grid from '@mui/material/Grid2'
// Update the type for _id to  (since MongoDB _id is typically a string)
export interface ProductType {
  _id: string; // Changed to string, assuming MongoDB's default ObjectId format
  name: string;
  image: string;
  price: number;
  category: string;
  qty:number
}

const HomeScreen = () => {
  const { data: products = [], isLoading, error } = useGetProductsQuery({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items");
 
  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "All Items"
      ? products
      : products.filter(
          (product: ProductType) => product.category === selectedCategory
        );

  // Type guard to check if error is FetchBaseQueryError
  const isFetchBaseQueryError = (
    error: any
  ): error is { data: { message: string }; error: string } => {
    return error && error.data && error.error;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  return (
    <Box sx={{ my: { xs: 8, sm: 10, md: 10 }, }}>
      {isLoading ? (
        <Loader />
      ) : error ? (
        isFetchBaseQueryError(error) ? (
          <Message variant="danger">
            {error.data.message || error.error}
          </Message>
        ) : (
          <Message variant="danger">An unexpected error occurred</Message>
        )
      ) : (
        <>
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',}}>
          <Tabs
            value={selectedCategory}
            onChange={handleTabChange}
            variant="scrollable"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#AA4AE3",  
                height: "1px",  
              },
              
            }}
            sx={{ mb: 3,}}
            
          >
            {" "}
            <Tab
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color:
                      selectedCategory === "All Items" ? "#AA4AE3" : "#9291A4",
                      fontSize:{xs:'0.7rem',md:"0.9rem"}
                  }}  
                >
                  <Box
                    component="img"
                    src="/images/allitems.png"
                    alt="All Items"
                    sx={{ width: { md: 180,xs:80 }, height: { md: 100,xs:40}, mb: 1 }}
                  />
                  All Items
                </Box>
              }
              value="All Items"
            />
            

            <Tab
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color:
                      selectedCategory === "Vegetables" ? "#AA4AE3" : "#9291A4",
                      fontSize:{xs:'0.7rem',md:"0.9rem"}
                  }}
                >
                  <Box
                    component="img"
                    src="/images/vegetables.png"
                    alt="Vegetables"
                    sx={{ width: { md: 180,xs:60 }, height: { md: 100,xs:40 }, mb: 1 }}
                  />
                  Fresh Vegetables
                </Box>
              }
              value="Vegetables"
            />
            <Tab
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color:
                      selectedCategory === "Fruits" ? "#AA4AE3" : "#9291A4",
                      fontSize:{xs:'0.7rem',md:"0.9rem"}
                  }}
                >
                  <Box
                    component="img"
                    src="/images/fruits.jpg"
                    alt="Fruits"
                    sx={{ width: { md: 100,xs:50 }, height: { md: 100,xs:40 }, mb: 1 }}
                  />
                  Fresh Fruits
                </Box>
              }
              value="Fruits"
            />
          </Tabs>

        </Box>
        
        <Box >
      <Grid container spacing={{ xs:2, md:1,sm:4,lg:2 }}>
          
            {filteredProducts.map((product: ProductType) => (
              <Grid size={{xs:6,md:3,sm:4,lg:2}} key={product._id}>
                <Product product={product}/>
              </Grid>
            ))}
        </Grid>
         </Box>
        </>
      )}
    </Box>
  );
};

export default HomeScreen;
