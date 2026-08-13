import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/Home/Home.tsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { Wines } from './components/Wines/Wines.tsx';

export const Root = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <FavouritesProvider>
          <Router>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="Wines" element={<Wines />} />
              </Route>
            </Routes>
          </Router>
        </FavouritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}