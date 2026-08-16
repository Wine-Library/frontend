import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/Home/Home.tsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { Wines } from './components/Wines/Wines.tsx';
import { Cart } from './components/Cart/Cart.tsx';
import { Favourites } from './components/Favourites/Favourites.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import Profile from './components/Profile/Profile.tsx';
import { WinePage } from './components/WinePage/WinePage.tsx';

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
                  <Route path="Wines" element={<Wines />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/basket" element={<Cart />} />
                  <Route path="Wines/:id" element={<WinePage />} />
                  <Route path="/favourites" element={<Favourites />} />
                </Route>
              </Routes>
            </Router>
          </ToastProvider>
        </FavouritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}