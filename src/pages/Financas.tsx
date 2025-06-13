import React, { useState, useEffect } from 'react';
import { MentorCard } from '../components/MentorCard';
import { MentorModal } from '../components/MentorModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { fetchMentors } from '../utils/supabaseService';
import { Mentor } from '../types/mentor';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Search, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const Financas = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const areaName = "Finanças";
  const areaDescription = "Conecte-se com especialistas em gestão financeira, planejamento, investimentos e controladoria empresarial.";

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setIsLoading(true);
      const mentorData = await fetchMentors();
      // Filtrar apenas mentores da área específica
      const filteredMentors = mentorData.filter(mentor => 
        mentor.setor?.toLowerCase().includes('finanças') || 
        mentor.setor?.toLowerCase().includes('financas') ||
        mentor.setor?.toLowerCase().includes('financeiro') ||
        mentor.setor?.toLowerCase().includes('contabil') ||
        mentor.setor?.toLowerCase().includes('investimento') ||
        mentor.setor?.toLowerCase().includes('contabilidade') ||
        mentor.setor?.toLowerCase().includes('controladoria') ||
        mentor.setor?.toLowerCase().includes('planejamento financeiro') ||
        mentor.setor?.toLowerCase().includes('fluxo de caixa') ||
        mentor.setor?.toLowerCase().includes('precificação') ||
        mentor.setor?.toLowerCase().includes('precificacao') ||
        false
      );
      setMentors(filteredMentors);
    } catch (error) {
      console.error('Error loading mentors:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar mentores. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMentor(null);
  };

  const handleMentorChosen = () => {
    loadMentors();
    handleModalClose();
  };

  const availableMentors = mentors.filter(mentor => mentor.disponivel);
  const unavailableMentors = mentors.filter(mentor => !mentor.disponivel);
  const allMentors = mentors; // Todos os mentores da área
  
  const filteredMentors = allMentors.filter(mentor =>
    mentor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-impulso-dark/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-impulso-dark/95 via-impulso-dark/90 to-impulso-light/95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          {/* Logo */}
          <div className="absolute top-6 left-6">
            <img src="/Logo_Impulso_Stone.ai_branco.png" alt="Impulso Stone" className="h-12" />
          </div>
          
          {/* Back Link */}
          <Link 
            to="/" 
            className="absolute top-6 right-6 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/25 transition-all duration-300 text-sm font-medium border border-white/20 inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          
          <div className="text-center mt-12">
            <div className="bg-white/15 backdrop-blur-sm rounded-full p-4 w-20 h-20 mx-auto mb-6 border border-white/20">
              <DollarSign className="w-12 h-12 text-white mx-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {areaName}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {areaDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-4 text-[#014837] font-medium">Carregando mentores de {areaName}...</p>
            </div>
          </div>
        )}

        {/* Mentors Grid */}
        {!isLoading && (
          <>
            {allMentors.length > 0 ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#014837] mb-2">
                    {allMentors.length} Mentor{allMentors.length !== 1 ? 'es' : ''} em {areaName}
                  </h2>
                  <div className="flex justify-center space-x-6 mb-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-[#11AC5C] to-[#0FCC7D] rounded-full mr-2"></div>
                      <span className="text-green-700 font-medium">{availableMentors.length} Disponível{availableMentors.length !== 1 ? 'is' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      <span className="text-red-600 font-medium">{unavailableMentors.length} Indisponível{unavailableMentors.length !== 1 ? 'is' : ''}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">Escolha o mentor ideal para acelerar seu crescimento na área</p>
                  
                  {/* Barra de Pesquisa */}
                  <div className="max-w-md mx-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Pesquisar mentor por nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border-[#11AC5C]/30 focus:border-[#11AC5C] focus:ring-[#11AC5C]/20"
                    />
                  </div>
                </div>
                
                {filteredMentors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMentors.map((mentor) => (
                      <MentorCard
                        key={mentor.id}
                        mentor={mentor}
                        onSelect={handleMentorSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#014837] mb-2">
                      Nenhum mentor encontrado
                    </h3>
                    <p className="text-gray-600">
                      Nenhum mentor foi encontrado com o termo "{searchTerm}". Tente uma pesquisa diferente.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-impulso-light/10 to-impulso-dark/10 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-16 h-16 text-impulso-light" />
                </div>
                <h3 className="text-2xl font-bold text-[#014837] mb-3">
                  Nenhum mentor disponível em {areaName}
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                  No momento não temos mentores disponíveis nesta área. Volte em breve para descobrir novos profissionais!
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center bg-gradient-to-r from-impulso-dark/90 to-impulso-light/90 text-white px-6 py-3 rounded-lg hover:from-impulso-light/90 hover:to-impulso-dark/90 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Ver todas as áreas
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mentor Selection Modal */}
      <MentorModal
        mentor={selectedMentor}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onMentorChosen={handleMentorChosen}
      />
    </div>
  );
};

export default Financas; 