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
    return mentors.filter(mentor => filterFunction(mentor)).length;
  };

  const getAreaAvailableMentorCount = (filterFunction: (mentor: Mentor) => boolean) => {
    return mentors.filter(mentor => mentor.disponivel && filterFunction(mentor)).length;
  };

  // Função para filtro de Marketing e Comunicação
  const isMarketingComunicacao = (mentor: Mentor) => {
    const setor = mentor.setor?.toLowerCase() || '';
    return setor.includes('marketing') || 
           setor.includes('comunicação') ||
           setor.includes('comunicacao') ||
           setor.includes('redes sociais') ||
           setor.includes('social media') ||
           setor.includes('conteúdo') ||
           setor.includes('conteudo') ||
           setor.includes('criatividade') ||
           setor.includes('campanhas') ||
           setor.includes('divulgação') ||
           setor.includes('divulgacao') ||
           setor.includes('branding') ||
           setor.includes('posicionamento de marca') ||
           setor.includes('gestão de tempo') ||
           setor.includes('gestao de tempo');
  };

  // Função para filtro de Comercial, Vendas e Relacionamento
  const isComercialVendas = (mentor: Mentor) => {
    const setor = mentor.setor?.toLowerCase() || '';
    return setor.includes('vendas') ||
           setor.includes('comercial') ||
           setor.includes('relacionamento') ||
           setor.includes('sales') ||
           setor.includes('negociação') ||
           setor.includes('negociacao') ||
           setor.includes('atendimento') ||
           setor.includes('customer') ||
           setor.includes('cliente') ||
           setor.includes('gestão de negócio') ||
           setor.includes('gestao de negocio') ||
           setor.includes('crescimento') ||
           setor.includes('prospecção') ||
           setor.includes('prospeccao') ||
           setor.includes('funil de vendas');
  };

  // Função para filtro de Finanças
  const isFinancas = (mentor: Mentor) => {
    const setor = mentor.setor?.toLowerCase() || '';
    return setor.includes('finanças') || 
           setor.includes('financas') ||
           setor.includes('financeiro') ||
           setor.includes('financeira') ||
           setor.includes('contabil') ||
           setor.includes('contabilidade') ||
           setor.includes('investimento') ||
           setor.includes('controladoria') ||
           setor.includes('planejamento financeiro') ||
           setor.includes('fluxo de caixa') ||
           setor.includes('precificação') ||
           setor.includes('precificacao') ||
           setor.includes('formação de preço') ||
           setor.includes('dre') ||
           setor.includes('fp&a') ||
           setor.includes('organização financeira') ||
           setor.includes('organizacao financeira');
  };

  // Função para filtro de Gestão, Inovação e Estratégia
  const isGestaoInovacao = (mentor: Mentor) => {
    const setor = mentor.setor?.toLowerCase() || '';
    return setor.includes('gestão') || 
           setor.includes('gestao') ||
           setor.includes('inovação') ||
           setor.includes('inovacao') ||
           setor.includes('estratégia') ||
           setor.includes('estrategia') ||
           setor.includes('liderança') ||
           setor.includes('lideranca') ||
           setor.includes('tecnologia') ||
           setor.includes('tech') ||
           setor.includes('desenvolvimento') ||
           setor.includes('programação') ||
           setor.includes('programacao') ||
           setor.includes('treinamento') ||
           setor.includes('planejamento') ||
           setor.includes('definição de metas') ||
           setor.includes('definicao de metas') ||
           setor.includes('adaptabilidade') ||
           setor.includes('gerenciamento') ||
           setor.includes('organização') ||
           setor.includes('organizacao') ||
           setor.includes('processos') ||
           setor.includes('melhoria contínua') ||
           setor.includes('melhoria continua') ||
           setor.includes('automação') ||
           setor.includes('automacao') ||
           setor.includes('inteligência artificial') ||
           setor.includes('inteligencia artificial') ||
           setor.includes('data') ||
           setor.includes('dados') ||
           setor.includes('analytics') ||
           setor.includes('kpi') ||
           setor.includes('produto') ||
           setor.includes('negócio') ||
           setor.includes('negocio');
  };

  const areas = [
    {
      name: "Comunicação e Marketing",
      route: "/marketing-comunicacao",
      description: "Divulgue melhor o seu negócio.",
      subDescription: "Mentores que sabem usar redes sociais, criar conteúdo e fortalecer sua marca.",
      icon: TrendingUp,
      color: "from-[#11AE5E]/90 to-[#10CA7B]/80",
      count: getAreaAvailableMentorCount(isMarketingComunicacao),
      totalCount: getAreaMentorCount(isMarketingComunicacao)
    },
    {
      name: "Comercial, Vendas e Relacionamento",
      route: "/comercial-vendas-relacionamento",
      description: "Venda mais e atenda melhor.",
      subDescription: "Mentores com experiência em negociação, atendimento e estratégias de vendas.",
      icon: Target,
      color: "from-[#11AE5E]/90 to-[#10CA7B]/80",
      count: getAreaAvailableMentorCount(isComercialVendas),
      totalCount: getAreaMentorCount(isComercialVendas)
    },
    {
      name: "Contabilidade e Finanças",
      route: "/financas",
      description: "Cuide bem do seu dinheiro.",
      subDescription: "Mentores que orientam sobre controle financeiro, precificação e fluxo de caixa.",
      icon: DollarSign,
      color: "from-[#11AE5E]/90 to-[#10CA7B]/80",
      count: getAreaAvailableMentorCount(isFinancas),
      totalCount: getAreaMentorCount(isFinancas)
    },
    {
      name: "Gestão, Inovação e Estratégia",
      route: "/gestao-inovacao-estrategia",
      description: "Organize e faça seu negócio crescer.",
      subDescription: "Mentores que ajudam com planejamento, rotina e ideias para inovar.",
      icon: BarChart3,
      color: "from-[#11AE5E]/90 to-[#10CA7B]/80",
      count: getAreaAvailableMentorCount(isGestaoInovacao),
      totalCount: getAreaMentorCount(isGestaoInovacao)
    }
  ];

  const totalAvailableMentors = mentors.filter(mentor => mentor.disponivel).length;
  const totalMentors = mentors.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#11AE5E]/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#11AE5E]/95 via-[#11AE5E]/90 to-[#10CA7B]/95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative">
          {/* Logo */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
            <img src="/Logo_Impulso_Stone.ai_branco.png" alt="Impulso Stone" className="h-8 sm:h-10 lg:h-12" />
          </div>
          
          {/* Admin Link */}
          <Link 
            to="/login" 
            className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/15 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-white/25 transition-all duration-300 text-xs sm:text-sm font-medium border border-white/20"
          >
            Admin
          </Link>
          <div className="text-center mt-8 sm:mt-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              Escolha o mentor ideal pra você e pro seu negócio
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4">
              Conecte-se com quem pode te ajudar a dar o próximo passo. Os mentores Impulso são especialistas da Stone prontos pra te ouvir e compartilhar dicas práticas pro dia a dia do seu negócio. É só escolher e agendar sua mentoria!
            </p>
            {!isLoading && (
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 px-4">
                <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 border border-white/20">
                  <span className="text-white font-semibold flex items-center text-sm sm:text-base">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {totalAvailableMentors} mentores disponíveis
                  </span>
                </div>
                {totalMentors > totalAvailableMentors && (
                  <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 border border-white/20">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {totalMentors - totalAvailableMentors} indisponíveis
                    </span>
                  </div>
                )}
                <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 border border-white/20">
                  <span className="text-white font-semibold text-sm sm:text-base">Impulsione o seu negócio!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Areas Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-[#10CA7B]/20 border-t-[#10CA7B] rounded-full mx-auto mb-4"></div>
              <p className="text-[#11AE5E] font-medium text-lg">Carregando áreas de mentoria...</p>
            </div>
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-[#11AE5E] mb-4">
                Nenhum mentor disponível no momento
              </h3>
              <p className="text-gray-600 mb-6">
                Estamos trabalhando para trazer novos mentores. Por favor, tente novamente mais tarde.
              </p>
              <button 
                onClick={loadMentors}
                className="bg-gradient-to-r from-[#11AE5E] to-[#10CA7B] text-white px-6 py-2 rounded-lg hover:from-[#10CA7B] hover:to-[#11AE5E] transition-all duration-300"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#11AE5E] mb-4">
              Escolha a área que você mais precisa de apoio
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Veja os temas disponíveis, entenda como cada área pode ajudar o seu negócio e encontre o mentor ideal pro seu momento.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {areas.map((area) => {
                const IconComponent = area.icon;
                return (
                  <Link
                    key={area.route}
                    to={area.route}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-[#10CA7B]/20">
                      {/* Header with gradient */}
                      <div className={`bg-gradient-to-r ${area.color} via-[#11AE5E]/90 p-6 sm:p-8 text-white`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3">
                            <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">{area.name}</h3>
                        <p className="text-white/90 text-base sm:text-lg font-medium">{area.description}</p>
                        <p className="text-white/80 text-sm sm:text-base mt-2">{area.subDescription}</p>
                      </div>

                      {/* Content */}
                      <div className="p-6 sm:p-8">
                        <div className="flex items-center justify-between">
                          <div className="text-[#11AE5E]">
                            <span className="text-2xl sm:text-3xl font-bold text-[#10CA7B]">{area.count}</span>
                            <span className="text-base sm:text-lg font-semibold ml-2">
                              mentor{area.count !== 1 ? 'es' : ''} disponíve{area.count !== 1 ? 'is' : ''}
                            </span>
                            
                          </div>
                          <div className="bg-[#10CA7B]/10 rounded-full p-2 sm:p-3 group-hover:bg-[#10CA7B] group-hover:text-[#11AE5E] transition-all duration-300">
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#10CA7B] group-hover:text-[#11AE5E]" />
                          </div>
                        </div>
                        
                        {area.totalCount === 0 && (
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
            <div className="text-center mt-12 sm:mt-16">
              <div className="bg-gradient-to-r from-[#11AE5E]/5 to-[#10CA7B]/10 rounded-2xl p-6 sm:p-8 border border-[#10CA7B]/20">
                <h3 className="text-xl sm:text-2xl font-bold text-[#11AE5E] mb-4">
                  Não encontrou sua área?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto px-4">
                  Estamos sempre expandindo nossa rede de mentores. Entre em contato conosco para sugestões de novas áreas ou mentores específicos.
                </p>
                <button className="bg-gradient-to-r from-[#11AE5E]/90 to-[#10CA7B]/90 text-white px-6 sm:px-8 py-3 rounded-lg hover:from-[#10CA7B]/90 hover:to-[#11AE5E]/90 transition-all duration-300 transform hover:scale-105 font-semibold">
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
