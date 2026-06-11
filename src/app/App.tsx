import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { GeolocationProvider } from './context/GeolocationContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <GeolocationProvider>
        <RouterProvider router={router} />
      </GeolocationProvider>
    </AuthProvider>
  );
}
