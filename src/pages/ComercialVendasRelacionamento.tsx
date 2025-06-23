import React, { useState, useEffect } from 'react';
import { MentorCard } from '../components/MentorCard';
import { MentorModal } from '../components/MentorModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { fetchMentors } from '../utils/supabaseService';
import { Mentor } from '../types/mentor';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Search, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const ComercialVendasRelacionamento = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const areaName = "Comercial, Vendas e Relacionamento";
  const areaDescription = "Conecte-se com especialistas em vendas, desenvolvimento comercial, relacionamento com clientes e negociação.";

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setIsLoading(true);
      const mentorData = await fetchMentors();
      // Filtrar apenas mentores da área específica
      const filteredMentors = mentorData.filter(mentor => 
        mentor.setor?.toLowerCase().includes('comercial') || 
        mentor.setor?.toLowerCase().includes('vendas') ||
        mentor.setor?.toLowerCase().includes('relacionamento') ||
        mentor.setor?.toLowerCase().includes('sales') ||
        mentor.setor?.toLowerCase().includes('negociação') ||
        mentor.setor?.toLowerCase().includes('negociacao') ||
        mentor.setor?.toLowerCase().includes('atendimento') ||
        mentor.setor?.toLowerCase().includes('customer success') ||
        mentor.setor?.toLowerCase().includes('cs') ||
        mentor.setor?.toLowerCase().includes('gestão de negócio') ||
        mentor.setor?.toLowerCase().includes('gestao de negocio') ||
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#11AE5E]/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#11AE5E]/95 via-[#11AE5E]/90 to-[#10CA7B]/95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative">
          {/* Logo */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
            <img src="/Logo_Impulso_Stone.ai_branco.png" alt="Impulso Stone" className="h-8 sm:h-10 lg:h-12" />
          </div>
          
          {/* Back Link */}
          <Link 
            to="/" 
            className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/15 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-white/25 transition-all duration-300 text-xs sm:text-sm font-medium border border-white/20 inline-flex items-center"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          
          <div className="text-center mt-8 sm:mt-12">
            <div className="bg-white/15 backdrop-blur-sm rounded-full p-3 sm:p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 border border-white/20">
              <Target className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight px-4">
              {areaName}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              {areaDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#014837] mb-2">
                    {allMentors.length} Mentor{allMentors.length !== 1 ? 'es' : ''} em {areaName}
                  </h2>
                  <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4">

                  </div>
                  <p className="text-gray-600 mb-4 sm:mb-6 px-4">Escolha o mentor ideal para acelerar seu crescimento na área</p>
                  
                  {/* Barra de Pesquisa */}
                  <div className="max-w-md mx-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Pesquisar mentor por nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 sm:pl-10 pr-4 py-2 w-full border-[#11AE5E]/30 focus:border-[#11AE5E] focus:ring-[#11AE5E]/20 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                {filteredMentors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
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
                    <h3 className="text-lg sm:text-xl font-semibold text-[#014837] mb-2">
                      Nenhum mentor encontrado
                    </h3>
                    <p className="text-gray-600 px-4">
                      Nenhum mentor foi encontrado com o termo "{searchTerm}". Tente uma pesquisa diferente.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 sm:py-20">
                <div className="bg-gradient-to-br from-[#10CA7B]/10 to-[#11AE5E]/10 rounded-full w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Target className="w-12 h-12 sm:w-16 sm:h-16 text-[#11AE5E]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#11AE5E] mb-4 px-4">
                  Nenhum mentor disponível em {areaName}
                </h3>
                <p className="text-gray-600 mb-6 px-4">
                  Estamos buscando profissionais qualificados nesta área. Volte em breve!
                </p>
                <Link 
                  to="/"
                  className="inline-flex items-center bg-gradient-to-r from-[#11AE5E]/90 to-[#10CA7B]/90 text-white px-4 sm:px-6 py-3 rounded-lg hover:from-[#10CA7B]/90 hover:to-[#11AE5E]/90 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Voltar às áreas
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

export default ComercialVendasRelacionamento; 