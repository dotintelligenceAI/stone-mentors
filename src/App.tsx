import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MarketingComunicacao from "./pages/MarketingComunicacao";
import ComercialVendasRelacionamento from "./pages/ComercialVendasRelacionamento";
import Financas from "./pages/Financas";
import GestaoInovacaoEstrategia from "./pages/GestaoInovacaoEstrategia";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketing-comunicacao" element={<MarketingComunicacao />} />
          <Route path="/comercial-vendas-relacionamento" element={<ComercialVendasRelacionamento />} />
          <Route path="/financas" element={<Financas />} />
          <Route path="/gestao-inovacao-estrategia" element={<GestaoInovacaoEstrategia />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
