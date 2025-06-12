import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAdminAuthenticated');
      setIsAuthenticated(authStatus === 'true');
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  // Mostrar loading enquanto verifica
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#11AC5C]/20 border-t-[#11AC5C] rounded-full mx-auto mb-4"></div>
          <p className="text-[#014837] font-medium">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar conteúdo protegido se autenticado
  return <>{children}</>;
};

export default ProtectedRoute; 