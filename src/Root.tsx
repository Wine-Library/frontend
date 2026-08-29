import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/Home/Home.tsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { Wines } from './Components/Wines/Wines.tsx';
import { Cart } from './Components/Cart/Cart.tsx';
import { Favourites } from './Components/Favourites/Favourites.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { OrderProvider } from './context/CheckoutContext.tsx';
import Profile from './Components/Profile/Profile.tsx';
import { WinePage } from './Components/WinePage/WinePage.tsx';
import { ConfirmEmailPage } from './Components/ConfirmEmailPage/ConfirmEmailPage.tsx';
import Signup from './Components/Signup/Signup.tsx';
import Login from './Components/Login/Login.tsx';
import { ResetPassword } from './Components/ResetPassword/ResetPassword.tsx';
import { ForgotPassword } from './Components/ForgotPass/ForgotPass.tsx';
import { ProfileDataChange } from './Components/ProfileDataChange/ProfileDataChange.tsx';
import { CheckEmail } from './Components/CheckEmail/CheckEmail.tsx';
import { Checkout } from './Components/Checkout/Checkout.tsx';
import { Orders } from './Components/Orders/Orders.tsx';

export const Root = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <FavouritesProvider>
          <ToastProvider>
            <OrderProvider>
            <Router>
              <Routes>
                <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="wines" element={<Wines />} />
                <Route path="wines/:id" element={<WinePage />} />
                <Route path="basket" element={<Cart />} />
                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="favourites" element={<Favourites />} />
                <Route path="auth/confirm-email" element={<ConfirmEmailPage />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="profile" element={<Profile />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="check-email" element={<CheckEmail />} />
                <Route path="profile/change-data" element={<ProfileDataChange />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<Orders />} />
              </Route>
              </Routes>
            </Router>
            </OrderProvider>
          </ToastProvider>
        </FavouritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}