import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './assets/styles/index.css'
import './assets/styles/bootstrap.custom.css'
import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider} from 'react-router-dom'
import HomeScreeen from './screens/HomeScreeen.tsx'
import ProductScreen from './screens/ProductScreen.tsx'
import { Provider } from 'react-redux'
import CartScreen from './screens/CartScreen.tsx'
// import 'bootstrap/dist/css/bootstrap.min.css'
import LoginScreen from './screens/LoginScreen.tsx'
import RegisterScreen from './screens/RegisterScreen.tsx'
import store from './store.ts'
import ShippingScreen from './screens/ShippingScreen.tsx'
import PrivateRoute from './components/PrivateRoute/PrivateRoute.tsx'
import PaymentScreen from './screens/PaymentScreen.tsx'
import PlaceOrderScreen from './screens/PlaceOrderScreen.tsx'
import OrderScreen from './screens/OrderScreen.tsx'
import ProfileScreen from './screens/ProfileScreen.tsx'
import AdminRoute from './components/AdminRoute/AdminRoute.tsx'
import OrderListScreen from './screens/Admin/OrderListScreen.tsx'
import ProductListScreen from './screens/Admin/ProductListScreen.tsx'
import ProductEditScreen from './screens/Admin/ProductEditScreen.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
        <Route index={true} path='/' element={<HomeScreeen/>}/>
        <Route  path='/product/:id' element={<ProductScreen/>}/>
        <Route  path='/cart' element={<CartScreen/>}/>
        <Route  path='/login' element={<LoginScreen/>}/>
        <Route  path='/register' element={<RegisterScreen/>}/>
        <Route  path='/order/:id' element={<OrderScreen/>}/>

        <Route path='' element={<PrivateRoute/>}>
        <Route  path='/shipping' element={<ShippingScreen/>}/>
        <Route path='/placeorder' element={<PlaceOrderScreen/>}/>
        <Route path='/payment' element={<PaymentScreen/>} />
        <Route path='/profile' element={<ProfileScreen/>}/>
        </Route>

        <Route path='' element={<AdminRoute/>}>
        <Route path='/admin/orderlist' element={<OrderListScreen/>}/>
        <Route path='/admin/productlist' element={<ProductListScreen/>}/>
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen/>}/>
        </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>
)
