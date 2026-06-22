import AppRoutes from './routes';
import { AppProvider } from './provider';

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
