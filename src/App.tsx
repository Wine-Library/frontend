import { Outlet } from 'react-router-dom';
import './styles/global.scss';

function App() {
  return (
    <div className="App">
      <Outlet />
    </div>
  )
}

export default App
