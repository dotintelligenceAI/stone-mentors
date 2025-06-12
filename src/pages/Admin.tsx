import React, { useState, useEffect } from 'react';
import { fetchMentorSubmissions } from '../utils/supabaseService';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Calendar, Mail, MessageSquare, User, Briefcase, LogOut, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface MentorSubmissionWithMentor {
  id: string;
  mentor_id: string;
  nome_usuario: string;
  email_usuario: string;
  telefone_usuario: string;
  motivo?: string;
  data_submissao: string;
  mentores: {
    nome: string;
    setor: string;
    foto_url: string;
  };
}

const Admin = () => {
  const [submissions, setSubmissions] = useState<MentorSubmissionWithMentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMentorSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar submissões. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.nome_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.mentores.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = filterSector === 'all' || 
      submission.mentores.setor.toLowerCase().includes(filterSector.toLowerCase());
    
    return matchesSearch && matchesSector;
  });

  const uniqueSectors = [...new Set(submissions.map(s => s.mentores.setor))];

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminEmail');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#014837] via-[#11AC5C] to-[#0FCC7D] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao início
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Painel Administrativo
              </h1>
              <p className="text-white/90 text-lg">
                Gerenciar relações Mentor-Usuário
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#11AC5C]">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-[#11AC5C] mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Submissões</p>
                <p className="text-2xl font-bold text-[#014837]">{submissions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#0FCC7D]">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-[#0FCC7D] mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Setores Únicos</p>
                <p className="text-2xl font-bold text-[#014837]">{uniqueSectors.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#014837]">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-[#014837] mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Última Submissão</p>
                <p className="text-sm font-bold text-[#014837]">
                  {submissions.length > 0 ? formatDate(submissions[0].data_submissao).split(' às')[0] : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#014837] mb-2">
                Buscar por nome, email ou mentor
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite para buscar..."
                className="w-full px-4 py-2 border border-[#11AC5C]/30 rounded-lg focus:ring-2 focus:ring-[#11AC5C]/20 focus:border-[#11AC5C]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#014837] mb-2">
                Filtrar por setor
              </label>
              <select
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                className="w-full px-4 py-2 border border-[#11AC5C]/30 rounded-lg focus:ring-2 focus:ring-[#11AC5C]/20 focus:border-[#11AC5C]"
              >
                <option value="all">Todos os setores</option>
                {uniqueSectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-[#11AC5C]/20 border-t-[#11AC5C] rounded-full mx-auto mb-4"></div>
              <p className="text-[#014837] font-medium">Carregando submissões...</p>
            </div>
          </div>
        )}

        {/* Submissions Table */}
        {!isLoading && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-[#11AC5C]/10 to-[#0FCC7D]/10 border-b border-[#11AC5C]/20">
              <h2 className="text-xl font-bold text-[#014837]">
                Submissões de Mentoria ({filteredSubmissions.length})
              </h2>
            </div>
            
            {filteredSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mentor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motivo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                              <img
                                src={submission.mentores.foto_url || "/placeholder.svg"}
                                alt={submission.mentores.nome}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#014837]">
                                {submission.mentores.nome}
                              </p>
                              <p className="text-sm text-gray-500">
                                {submission.mentores.setor}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-[#11AC5C] mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {submission.nome_usuario}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-[#11AC5C]" />
                            <span className="text-sm text-gray-600">{submission.email_usuario}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-[#11AC5C]" />
                            <span className="text-sm text-gray-600">{submission.telefone_usuario}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {formatDate(submission.data_submissao)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600 max-w-xs">
                              {submission.motivo || 'Nenhum motivo especificado'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma submissão encontrada
                </h3>
                <p className="text-gray-500">
                  {searchTerm || filterSector !== 'all' 
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Ainda não há submissões de mentoria registradas.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin; 