import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Inscricao } from './pages/Inscricao';
import { Votar } from './pages/Votar';
import { Resultados } from './pages/Resultados';
import { Assistencia } from './pages/Assistencia';
import { Sobre } from './pages/Sobre';
import { Admin } from './pages/Admin';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'login', Component: Login },
      { path: 'inscricao', Component: Inscricao },
      { path: 'votar', Component: Votar },
      { path: 'resultados', Component: Resultados },
      { path: 'assistencia', Component: Assistencia },
      { path: 'sobre', Component: Sobre },
      { path: 'admin', Component: Admin },
    ],
  },
]);
