import { createRoot } from 'react-dom/client'
import { Root } from './Root'
import { Root } from './root.tsx'
import './styles/global.module.scss';

createRoot(document.getElementById('root')!).render(<Root />)
