import { AuthProvider } from '../shared/context/AuthContext';

export function AppProvider({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
