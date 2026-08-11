import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './Components/Home/Home.tsx';

export const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}