import { createRoot } from 'react-dom/client'
import { Root } from './Root'
import './styles/global.module.scss';

createRoot(document.getElementById('root')!).render(<Root />)
