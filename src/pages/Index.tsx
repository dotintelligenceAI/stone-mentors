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
      if (!mentorData || mentorData.length === 0) {
        throw new Error('Nenhum mentor encontrado');
      }
      setMentors(mentorData);
    } catch (error) {
      console.error('Error loading mentors:', error);
      toast({
        title: "Erro ao carregar mentores",
        description: "Não foi possível carregar os mentores. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
      setMentors([]); // Garante que o estado seja limpo em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const getAreaMentorCount = (filterFunction: (mentor: Mentor) => boolean) => {
    return mentors.filter(mentor => mentor.disponivel && filterFunction(mentor)).length;
  };

  const areas = [
    {
      name: "Comunicação e Marketing",
      route: "/marketing-comunicacao",
      description: "Divulgue melhor o seu negócio.",
      subDescription: "Mentores que sabem usar redes sociais, criar conteúdo e fortalecer sua marca.",
      icon: TrendingUp,
      color: "from-impulso-dark to-impulso-light",
      count: getAreaMentorCount(mentor => 
        mentor.especialidades?.some(esp => 
          esp.toLowerCase().includes('marketing') || 
          esp.toLowerCase().includes('comunicação')
        ) || false
      )
    },
    {
      name: "Comercial, Vendas e Relacionamento",
      route: "/comercial-vendas-relacionamento",
      description: "Venda mais e atenda melhor.",
      subDescription: "Mentores com experiência em negociação, atendimento e estratégias de vendas.",
      icon: Target,
      color: "from-impulso-dark to-impulso-light",
      count: getAreaMentorCount(mentor => 
        mentor.especialidades?.some(esp => 
          esp.toLowerCase().includes('comercial') || 
          esp.toLowerCase().includes('vendas') ||
          esp.toLowerCase().includes('relacionamento') ||
          esp.toLowerCase().includes('sales')
        ) || false
      )
    },
    {
      name: "Contabilidade e Finanças",
      route: "/financas",
      description: "Cuide bem do seu dinheiro.",
      subDescription: "Mentores que orientam sobre controle financeiro, precificação e fluxo de caixa.",
      icon: DollarSign,
      color: "from-impulso-dark to-impulso-light",
      count: getAreaMentorCount(mentor => 
        mentor.especialidades?.some(esp => 
          esp.toLowerCase().includes('finanças') || 
          esp.toLowerCase().includes('financas') ||
          esp.toLowerCase().includes('financeiro') ||
          esp.toLowerCase().includes('contabil') ||
          esp.toLowerCase().includes('investimento')
        ) || false
      )
    },
    {
      name: "Gestão, Inovação e Estratégia",
      route: "/gestao-inovacao-estrategia",
      description: "Organize e faça seu negócio crescer.",
      subDescription: "Mentores que ajudam com planejamento, rotina e ideias para inovar.",
      icon: BarChart3,
      color: "from-impulso-dark to-impulso-light",
      count: getAreaMentorCount(mentor => 
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
          esp.toLowerCase().includes('data')
        ) || false
      )
    }
  ];

  const totalAvailableMentors = mentors.filter(mentor => mentor.disponivel).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-impulso-dark/5 to-impulso-dark/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-impulso-dark via-impulso-dark/90 to-impulso-light shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          {/* Logo */}
          <div className="absolute top-6 left-6">
            <img src="/Logo_Impulso_Stone.ai_branco.png" alt="Impulso Stone" className="h-12" />
          </div>
          
          {/* Admin Link */}
          <Link 
            to="/login" 
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 text-sm font-medium"
          >
            Admin
          </Link>
          <div className="text-center mt-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Escolha o mentor ideal pra você e pro seu negócio
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12">
              Conecte-se com quem pode te ajudar a dar o próximo passo. Os mentores Impulso são especialistas da Stone prontos pra te ouvir e compartilhar dicas práticas pro dia a dia do seu negócio. É só escolher e agendar sua mentoria!
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
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-impulso-light/20 border-t-impulso-light rounded-full mx-auto mb-4"></div>
              <p className="text-impulso-dark font-medium text-lg">Carregando áreas de mentoria...</p>
            </div>
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-impulso-dark mb-4">
                Nenhum mentor disponível no momento
              </h3>
              <p className="text-gray-600 mb-6">
                Estamos trabalhando para trazer novos mentores. Por favor, tente novamente mais tarde.
              </p>
              <button 
                onClick={loadMentors}
                className="bg-gradient-to-r from-impulso-dark to-impulso-light text-white px-6 py-2 rounded-lg hover:from-impulso-light hover:to-impulso-dark transition-all duration-300"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-impulso-dark mb-4">
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
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-impulso-light/20">
                      {/* Header with gradient */}
                      <div className={`bg-gradient-to-r ${area.color} via-impulso-dark/90 p-8 text-white`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <IconComponent className="w-8 h-8" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{area.name}</h3>
                        <p className="text-white/90 text-lg font-medium">{area.description}</p>
                        <p className="text-white/80 text-base mt-2">{area.subDescription}</p>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <div className="flex items-center justify-between">
                          <div className="text-impulso-dark">
                            <span className="text-3xl font-bold text-impulso-light">{area.count}</span>
                            <span className="text-lg font-semibold ml-2">
                              mentor{area.count !== 1 ? 'es' : ''} disponível{area.count !== 1 ? 'is' : ''}
                            </span>
                          </div>
                          <div className="bg-impulso-light/10 rounded-full p-3 group-hover:bg-impulso-light group-hover:text-impulso-dark transition-all duration-300">
                            <ArrowRight className="w-6 h-6 text-impulso-light group-hover:text-impulso-dark" />
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
              <div className="bg-gradient-to-r from-impulso-dark/10 to-impulso-purple/20 rounded-2xl p-8 border border-impulso-light/20">
                <h3 className="text-2xl font-bold text-impulso-dark mb-4">
                  Não encontrou sua área?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Estamos sempre expandindo nossa rede de mentores. Entre em contato conosco para sugestões de novas áreas ou mentores específicos.
                </p>
                <button className="bg-gradient-to-r from-impulso-dark to-impulso-light text-white px-8 py-3 rounded-lg hover:from-impulso-light hover:to-impulso-dark transition-all duration-300 transform hover:scale-105 font-semibold">
                  Fale Conosco
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
