import React, { useState, useEffect } from 'react';
import { MentorCard } from '../components/MentorCard';
import { MentorModal } from '../components/MentorModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { fetchMentors } from '../utils/supabaseService';
import { Mentor } from '../types/mentor';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const GestaoInovacaoEstrategia = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const areaName = "Gestão, Inovação e Estratégia";
  const areaDescription = "Conecte-se com líderes especialistas em gestão empresarial, inovação, tecnologia, planejamento estratégico e transformação organizacional.";

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setIsLoading(true);
      const mentorData = await fetchMentors();
      // Filtrar apenas mentores da área específica
      const filteredMentors = mentorData.filter(mentor => 
        mentor.especialidades?.some(esp => 
          esp.toLowerCase().includes('gestão') || 
          esp.toLowerCase().includes('gestao') ||
          esp.toLowerCase().includes('inovação') ||
          esp.toLowerCase().includes('inovacao') ||
          esp.toLowerCase().includes('estratégia') ||
          esp.toLowerCase().includes('estrategia') ||
          esp.toLowerCase().includes('liderança') ||
          esp.toLowerCase().includes('lideranca') ||
          esp.toLowerCase().includes('ceo') ||
          esp.toLowerCase().includes('diretor') ||
          esp.toLowerCase().includes('tecnologia') ||
          esp.toLowerCase().includes('tech') ||
          esp.toLowerCase().includes('ti') ||
          esp.toLowerCase().includes('desenvolvimento') ||
          esp.toLowerCase().includes('programação') ||
          esp.toLowerCase().includes('programacao') ||
          esp.toLowerCase().includes('software') ||
          esp.toLowerCase().includes('digital') ||
          esp.toLowerCase().includes('dados') ||
          esp.toLowerCase().includes('data') ||
          esp.toLowerCase().includes('transformação digital') ||
          esp.toLowerCase().includes('transformacao digital') ||
          esp.toLowerCase().includes('agile') ||
          esp.toLowerCase().includes('scrum') ||
          esp.toLowerCase().includes('product management') ||
          esp.toLowerCase().includes('gestão de produtos') ||
          esp.toLowerCase().includes('gestao de produtos')
        ) || false
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#014837] via-[#11AC5C] to-[#0FCC7D] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para todas as áreas
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {areaName}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {areaDescription}
            </p>
            <div className="mt-8 flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-white font-semibold">🚀 Transforme sua liderança!</span>
              </div>
            </div>
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
            {availableMentors.length > 0 ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#014837] mb-2">
                    {availableMentors.length} Mentor{availableMentors.length !== 1 ? 'es' : ''} Disponível{availableMentors.length !== 1 ? 'is' : ''} em {areaName}
                  </h2>
                  <p className="text-gray-600">Escolha o mentor ideal para acelerar seu crescimento na área</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {availableMentors.map((mentor) => (
                    <MentorCard
                      key={mentor.id}
                      mentor={mentor}
                      onSelect={handleMentorSelect}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-[#11AC5C]/10 to-[#0FCC7D]/10 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                  <div className="text-[#11AC5C] text-6xl">🚀</div>
                </div>
                <h3 className="text-2xl font-bold text-[#014837] mb-3">
                  Nenhum mentor disponível em {areaName}
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                  No momento não temos mentores disponíveis nesta área. Volte em breve para descobrir novos profissionais!
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center bg-gradient-to-r from-[#11AC5C] to-[#0FCC7D] text-white px-6 py-3 rounded-lg hover:from-[#014837] hover:to-[#11AC5C] transition-all duration-300"
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

export default GestaoInovacaoEstrategia; 