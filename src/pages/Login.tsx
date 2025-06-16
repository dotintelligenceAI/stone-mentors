import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Credenciais fixas
    const validEmail = 'stone@gmaill.com';
    const validPassword = 'stone123@';

    // Simular um pequeno delay para parecer mais realista
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email === validEmail && password === validPassword) {
      // Salvar estado de autenticação no localStorage
      localStorage.setItem('isAdminAuthenticated', 'true');
      localStorage.setItem('adminEmail', email);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o painel administrativo...",
      });

      // Redirecionar para admin
      navigate('/admin');
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-[#11AC5C] hover:text-[#014837] transition-colors duration-200 mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Voltar ao início</span>
            <span className="sm:hidden">Voltar</span>
          </Link>
          
          <div className="bg-gradient-to-r from-[#11AC5C] to-[#0FCC7D] rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-[#014837] mb-2">
            Acesso Administrativo
          </h1>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            Entre com suas credenciais para acessar o painel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-[#11AC5C]/20">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-[#014837] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#11AC5C]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-[#11AC5C]/30 rounded-lg focus:ring-2 focus:ring-[#11AC5C]/20 focus:border-[#11AC5C] transition-all duration-200 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#014837] mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#11AC5C]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-[#11AC5C]/30 rounded-lg focus:ring-2 focus:ring-[#11AC5C]/20 focus:border-[#11AC5C] transition-all duration-200 text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#11AC5C] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform text-sm sm:text-base ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#11AC5C] to-[#0FCC7D] hover:from-[#014837] hover:to-[#11AC5C] hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/20 border-t-white rounded-full mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
          <p>Field of Mentor - Painel Administrativo</p>
          <p className="mt-1">Acesso restrito a administradores</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 