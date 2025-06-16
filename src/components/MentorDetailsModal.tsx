import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Mentor } from '../types/mentor';
import { MapPin, Mail, Phone, Clock, Briefcase, User, Tag } from 'lucide-react';

interface MentorDetailsModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MentorDetailsModal: React.FC<MentorDetailsModalProps> = ({
  mentor,
  isOpen,
  onClose,
}) => {
  if (!mentor) return null;

  const especialidadesArray = mentor.especialidades || [];
  const tagsArray = mentor.tags || [];

  // Função para formatar data e hora para o formato brasileiro
  const formatarDataHoraBrasileira = (dataString: string): string => {
    try {
      // Se a data já está no formato brasileiro, retorna como está
      if (dataString.includes('/') && dataString.match(/^\d{2}\/\d{2}\/\d{4}/)) {
        return dataString;
      }

      // Tenta converter diferentes formatos de data
      let data: Date;
      
      // Formato ISO (YYYY-MM-DD HH:MM:SS ou YYYY-MM-DDTHH:MM:SS)
      if (dataString.includes('T') || dataString.match(/^\d{4}-\d{2}-\d{2}/)) {
        data = new Date(dataString);
      }
      // Formato americano (MM/DD/YYYY HH:MM:SS)
      else if (dataString.match(/^\d{2}\/\d{2}\/\d{4}/)) {
        const [datePart, timePart] = dataString.split(' ');
        const [month, day, year] = datePart.split('/');
        data = new Date(`${year}-${month}-${day}${timePart ? 'T' + timePart : ''}`);
      }
      // Outros formatos
      else {
        data = new Date(dataString);
      }

      // Verifica se a data é válida
      if (isNaN(data.getTime())) {
        return dataString; // Retorna o original se não conseguir converter
      }

      // Formata para DD/MM/AAAA HH:MM
      const dia = data.getDate().toString().padStart(2, '0');
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      const ano = data.getFullYear();
      const horas = data.getHours().toString().padStart(2, '0');
      const minutos = data.getMinutes().toString().padStart(2, '0');

      return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    } catch (error) {
      // Em caso de erro, retorna a string original
      return dataString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-white border-2 border-impulso-light/20 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-impulso-light/20 scrollbar-track-transparent hover:scrollbar-thumb-impulso-light/40">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-impulso-dark">
            Detalhes do Mentor
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Mentor Header */}
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-impulso-light/30 shadow-lg">
              <img
                src={mentor.foto_url || "/placeholder.svg"}
                alt={mentor.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-impulso-dark mb-2">{mentor.nome}</h3>
              <div className="flex items-center text-impulso-light mb-2">
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="font-semibold">{mentor.cargo_atual}</span>
              </div>
              {mentor.empresa_atual && (
                <div className="flex items-center text-gray-600 mb-2">
                  <User className="w-4 h-4 mr-2 text-impulso-light" />
                  <span>{mentor.empresa_atual}</span>
                </div>
              )}
              {mentor.cidade && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-impulso-light" />
                  <span>{mentor.cidade}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-impulso-light/10 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-impulso-dark mb-2">Informações de Contato</h4>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-impulso-light" />
              <span className="text-gray-600">{mentor.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-impulso-light" />
              <span className="text-gray-600">{mentor.telefone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-impulso-light" />
              <span className="text-gray-600">
                {mentor.disponivel ? "Disponível" : "Indisponível"}
              </span>
            </div>
            {mentor.disponibilidade && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-impulso-light" />
                <span className="text-gray-600">Horário: {mentor.disponibilidade}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {mentor.descricao && (
            <div>
              <h4 className="font-semibold text-impulso-dark mb-2">Sobre</h4>
              <p className="text-gray-600 leading-relaxed">{mentor.descricao}</p>
            </div>
          )}

          {/* Setor */}
          {mentor.setor && (
            <div>
              <h4 className="font-semibold text-impulso-dark mb-2">Setor</h4>
              <Badge className="bg-impulso-dark text-white">
                {mentor.setor}
              </Badge>
            </div>
          )}

          {/* Experience */}
          {mentor.experiencia_profissional && (
            <div>
              <h4 className="font-semibold text-impulso-dark mb-2">Experiência Profissional</h4>
              <p className="text-gray-600 leading-relaxed">{mentor.experiencia_profissional}</p>
            </div>
          )}

          {/* Education */}
          {mentor.formacao_academica && (
            <div>
              <h4 className="font-semibold text-impulso-dark mb-2">Formação Acadêmica</h4>
              <p className="text-gray-600 leading-relaxed">{mentor.formacao_academica}</p>
            </div>
          )}

          {/* Specialties */}
          {especialidadesArray.length > 0 && (
            <div>
              <h4 className="font-semibold text-impulso-dark mb-2">Especialidades</h4>
              <div className="flex flex-wrap gap-2">
                {especialidadesArray.map((especialidade, index) => (
                  <Badge 
                    key={index} 
                    className="bg-impulso-dark text-white hover:bg-impulso-light hover:text-impulso-dark transition-all duration-300 text-xs font-medium"
                  >
                    <span className="mr-1">•</span>
                    {especialidade}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tagsArray.length > 0 && (
            <div>
              <h4 className="font-semibold text-impulso-dark mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tagsArray.map((tag, index) => (
                  <Badge 
                    key={index} 
                    className="bg-impulso-dark text-white hover:bg-impulso-light hover:text-impulso-dark transition-all duration-300 text-xs font-medium"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Opções de Agenda */}
          {(mentor.opcao_agenda_um || mentor.opcao_agenda_dois || mentor.opcao_agenda_tres) && (
            <div>
              <h4 className="font-semibold text-impulso-dark mb-3">Opções de Agenda Disponíveis</h4>
              <div className="space-y-3">
                {mentor.opcao_agenda_um && (
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-impulso-light/10 to-impulso-dark/5 rounded-lg p-4 border border-impulso-light/20 hover:border-impulso-light/40 transition-all duration-300">
                    <div className="bg-impulso-light/20 rounded-full p-2">
                      <Clock className="w-5 h-5 text-impulso-dark" />
                    </div>
                    <div className="flex-1">
                      <span className="text-impulso-dark font-semibold block mb-1">Opção 1:</span>
                      <span className="text-gray-700 font-medium text-lg">
                        {formatarDataHoraBrasileira(mentor.opcao_agenda_um)}
                      </span>
                    </div>
                  </div>
                )}
                {mentor.opcao_agenda_dois && (
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-impulso-light/10 to-impulso-dark/5 rounded-lg p-4 border border-impulso-light/20 hover:border-impulso-light/40 transition-all duration-300">
                    <div className="bg-impulso-light/20 rounded-full p-2">
                      <Clock className="w-5 h-5 text-impulso-dark" />
                    </div>
                    <div className="flex-1">
                      <span className="text-impulso-dark font-semibold block mb-1">Opção 2:</span>
                      <span className="text-gray-700 font-medium text-lg">
                        {formatarDataHoraBrasileira(mentor.opcao_agenda_dois)}
                      </span>
                    </div>
                  </div>
                )}
                {mentor.opcao_agenda_tres && (
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-impulso-light/10 to-impulso-dark/5 rounded-lg p-4 border border-impulso-light/20 hover:border-impulso-light/40 transition-all duration-300">
                    <div className="bg-impulso-light/20 rounded-full p-2">
                      <Clock className="w-5 h-5 text-impulso-dark" />
                    </div>
                    <div className="flex-1">
                      <span className="text-impulso-dark font-semibold block mb-1">Opção 3:</span>
                      <span className="text-gray-700 font-medium text-lg">
                        {formatarDataHoraBrasileira(mentor.opcao_agenda_tres)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 