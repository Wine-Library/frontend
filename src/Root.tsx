import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/Home/Home.tsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { Wines } from './Components/Wines/Wines.tsx';
import { Cart } from './Components/Cart/Cart.tsx';
import { Favourites } from './Components/Favourites/Favourites.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import Profile from './Components/Profile/Profile.tsx';
import { WinePage } from './Components/WinePage/WinePage.tsx';
import { ConfirmEmailPage } from './Components/ConfirmEmailPage/ConfirmEmailPage.tsx';

export const Root = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <FavouritesProvider>
          <ToastProvider>
            <Router>
              <Routes>
                <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="wines" element={<Wines />} />
                <Route path="wines/:id" element={<WinePage />} />
                <Route path="basket" element={<Cart />} />
                <Route path="favourites" element={<Favourites />} />
                <Route path="auth/confirm-email" element={<ConfirmEmailPage />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              </Routes>
            </Router>
          </ToastProvider>
        </FavouritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}