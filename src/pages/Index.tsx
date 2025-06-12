import React, { useState, useEffect } from 'react';
import { fetchMentors } from '../utils/supabaseService';
import { Mentor } from '../types/mentor';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';

const Index = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setIsLoading(true);
      const mentorData = await fetchMentors();
      setMentors(mentorData);
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

  const getAreaMentorCount = (filterFunction: (mentor: Mentor) => boolean) => {
    return mentors.filter(mentor => mentor.disponivel && filterFunction(mentor)).length;
  };

  const areas = [
    {
      name: "Marketing e Comunicação",
      route: "/marketing-comunicacao",
      description: "Especialistas em marketing digital, branding e comunicação",
      icon: TrendingUp,
      color: "from-[#11AC5C] to-[#0FCC7D]",
      emoji: "📈",
      count: getAreaMentorCount(mentor => 
        mentor.setor.toLowerCase().includes('marketing') || 
        mentor.setor.toLowerCase().includes('comunicação')
      )
    },
    {
      name: "Comercial, Vendas e Relacionamento",
      route: "/comercial-vendas-relacionamento",
      description: "Profissionais de vendas, negociação e relacionamento com clientes",
      icon: Target,
      color: "from-[#014837] to-[#11AC5C]",
      emoji: "🎯",
      count: getAreaMentorCount(mentor => 
        mentor.setor.toLowerCase().includes('comercial') || 
        mentor.setor.toLowerCase().includes('vendas') ||
        mentor.setor.toLowerCase().includes('relacionamento') ||
        mentor.setor.toLowerCase().includes('sales')
      )
    },
    {
      name: "Finanças",
      route: "/financas",
      description: "Experts em gestão financeira, planejamento e investimentos",
      icon: DollarSign,
      color: "from-[#0FCC7D] to-[#11AC5C]",
      emoji: "💰",
      count: getAreaMentorCount(mentor => 
        mentor.setor.toLowerCase().includes('finanças') || 
        mentor.setor.toLowerCase().includes('financas') ||
        mentor.setor.toLowerCase().includes('financeiro') ||
        mentor.setor.toLowerCase().includes('contabil') ||
        mentor.setor.toLowerCase().includes('investimento')
      )
    },
    {
      name: "Gestão, Inovação e Estratégia",
      route: "/gestao-inovacao-estrategia",
      description: "Líderes em gestão empresarial, inovação, tecnologia e estratégia",
      icon: BarChart3,
      color: "from-[#11AC5C] to-[#014837]",
      emoji: "🚀",
      count: getAreaMentorCount(mentor => 
        mentor.setor.toLowerCase().includes('gestão') || 
        mentor.setor.toLowerCase().includes('gestao') ||
        mentor.setor.toLowerCase().includes('inovação') ||
        mentor.setor.toLowerCase().includes('inovacao') ||
        mentor.setor.toLowerCase().includes('estratégia') ||
        mentor.setor.toLowerCase().includes('estrategia') ||
        mentor.setor.toLowerCase().includes('liderança') ||
        mentor.setor.toLowerCase().includes('lideranca') ||
        mentor.setor.toLowerCase().includes('ceo') ||
        mentor.setor.toLowerCase().includes('diretor') ||
        mentor.setor.toLowerCase().includes('tecnologia') ||
        mentor.setor.toLowerCase().includes('tech') ||
        mentor.setor.toLowerCase().includes('ti') ||
        mentor.setor.toLowerCase().includes('desenvolvimento') ||
        mentor.setor.toLowerCase().includes('programação') ||
        mentor.setor.toLowerCase().includes('programacao') ||
        mentor.setor.toLowerCase().includes('software') ||
        mentor.setor.toLowerCase().includes('digital') ||
        mentor.setor.toLowerCase().includes('dados') ||
        mentor.setor.toLowerCase().includes('data')
      )
    }
  ];

  const totalAvailableMentors = mentors.filter(mentor => mentor.disponivel).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#014837] via-[#11AC5C] to-[#0FCC7D] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          {/* Admin Link */}
          <Link 
            to="/login" 
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 text-sm font-medium"
          >
            Admin
          </Link>
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Encontre Seu Mentor Perfeito
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
              Escolha sua área de interesse e conecte-se com profissionais experientes
            </p>
            {!isLoading && (
              <div className="flex justify-center items-center space-x-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="text-white font-semibold flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    {totalAvailableMentors} mentores disponíveis
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="text-white font-semibold">🚀 Acelere sua carreira hoje!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Areas Grid */}
        {!isLoading ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#014837] mb-4">
                Escolha Sua Área de Interesse
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Navegue pelas diferentes especialidades e encontre o mentor ideal para sua jornada profissional
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {areas.map((area) => {
                const IconComponent = area.icon;
                return (
                  <Link
                    key={area.route}
                    to={area.route}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-[#11AC5C]/20">
                      {/* Header with gradient */}
                      <div className={`bg-gradient-to-r ${area.color} p-8 text-white`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-5xl">{area.emoji}</div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <IconComponent className="w-8 h-8" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{area.name}</h3>
                        <p className="text-white/90 text-lg">{area.description}</p>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <div className="flex items-center justify-between">
                          <div className="text-[#014837]">
                            <span className="text-3xl font-bold text-[#11AC5C]">{area.count}</span>
                            <span className="text-lg font-semibold ml-2">
                              mentor{area.count !== 1 ? 'es' : ''} disponível{area.count !== 1 ? 'is' : ''}
                            </span>
                          </div>
                          <div className="bg-[#11AC5C]/10 rounded-full p-3 group-hover:bg-[#11AC5C] group-hover:text-white transition-all duration-300">
                            <ArrowRight className="w-6 h-6 text-[#11AC5C] group-hover:text-white" />
                          </div>
                        </div>
                        
                        {area.count === 0 && (
                          <div className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                            Novos mentores em breve!
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-[#11AC5C]/10 to-[#0FCC7D]/10 rounded-2xl p-8 border border-[#11AC5C]/20">
                <h3 className="text-2xl font-bold text-[#014837] mb-4">
                  Não encontrou sua área?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Estamos sempre expandindo nossa rede de mentores. Entre em contato conosco para sugestões de novas áreas ou mentores específicos.
                </p>
                <button className="bg-gradient-to-r from-[#11AC5C] to-[#0FCC7D] text-white px-8 py-3 rounded-lg hover:from-[#014837] hover:to-[#11AC5C] transition-all duration-300 transform hover:scale-105 font-semibold">
                  Fale Conosco
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-[#11AC5C]/20 border-t-[#11AC5C] rounded-full mx-auto mb-4"></div>
              <p className="text-[#014837] font-medium text-lg">Carregando áreas de mentoria...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
