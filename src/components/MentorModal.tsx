import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mentor } from '../types/mentor';
import { submitMentorChoice, updateMentorAvailability } from '../utils/supabaseService';
import { sendMentorNotification, sendUserNotification } from '../utils/evolution_api';
import { toast } from '@/hooks/use-toast';
import { User, Mail, MessageSquare, Phone, X, MapPin, Briefcase, Clock, Tag, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MentorModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onClose: () => void;
  onMentorChosen: () => void;
}

export const MentorModal: React.FC<MentorModalProps> = ({
  mentor,
  isOpen,
  onClose,
  onMentorChosen,
}) => {
  const [formData, setFormData] = useState({
    nome_usuario: '',
    email_usuario: '',
    telefone_usuario: '',
    motivo: '',
    agenda: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Aplicar máscara no telefone
    if (name === 'telefone_usuario') {
      const phoneValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
      let formattedPhone = phoneValue;
      
      if (phoneValue.length <= 11) {
        // Formatar como (11) 99999-9999
        formattedPhone = phoneValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        if (phoneValue.length === 10) {
          // Formatar como (11) 9999-9999 para números antigos
          formattedPhone = phoneValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mentor) return;
    
    if (!formData.nome_usuario || !formData.email_usuario || !formData.telefone_usuario || !formData.agenda) {
      toast({
        title: "Informações Obrigatórias",
        description: "Por favor, preencha nome, email, telefone e agenda.",
        variant: "destructive",
      });
      return;
    }

    // Validar formato do telefone
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = formData.telefone_usuario.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      toast({
        title: "Telefone Inválido",
        description: "Por favor, digite um número de telefone válido com DDD.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting mentor choice:', { mentor: mentor.nome, formData });
      
      // Enviar com telefone limpo para o banco
      await submitMentorChoice({
        mentor_id: mentor.id!,
        nome_usuario: formData.nome_usuario,
        email_usuario: formData.email_usuario,
        telefone_usuario: cleanPhone, // Telefone limpo para o banco
        motivo: formData.motivo,
      });

      await updateMentorAvailability(mentor.id!, false);

      // Enviar notificações via WhatsApp com telefone limpo
      try {
        // Notificação para o mentor
        await sendMentorNotification({
          mentorNome: mentor.nome,
          mentorTelefone: mentor.telefone,
          empreendedorNome: formData.nome_usuario,
          empreendedorTelefone: cleanPhone, // Telefone limpo para WhatsApp
          empreendedorEmail: formData.email_usuario,
        });

        // Notificação para o usuário
        await sendUserNotification({
          empreendedorNome: formData.nome_usuario,
          empreendedorTelefone: cleanPhone, // Telefone limpo para WhatsApp
          mentorNome: mentor.nome,
        });
      } catch (whatsappError) {
        console.error('Erro ao enviar mensagens WhatsApp:', whatsappError);
        // Não falha o processo se o WhatsApp falhar
        toast({
          title: "Mentoria Confirmada!",
          description: `Sua escolha do mentor ${mentor.nome} foi registrada com sucesso! Em caso de problemas com as notificações, entre em contato conosco.`,
          variant: "default",
        });
      }

      toast({
        title: "Sucesso!",
        description: `Você escolheu ${mentor.nome} como seu mentor. Eles entrarão em contato em breve!`,
      });

      setFormData({ nome_usuario: '', email_usuario: '', telefone_usuario: '', motivo: '', agenda: '' });
      setShowForm(false);
      onMentorChosen();
    } catch (error) {
      console.error('Error submitting mentor choice:', error);
      toast({
        title: "Erro",
        description: "Falha ao submeter sua escolha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mentor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-white p-0 overflow-hidden rounded-lg border-0 shadow-2xl max-h-[90vh]">
        <div className="relative">
          {/* Header */}
          <div className="bg-impulso-dark p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {showForm ? "Escolher Mentor" : "Detalhes do Mentor"}
              </DialogTitle>
              <DialogDescription className="text-white/90">
                {showForm 
                  ? "Preencha seus dados para entrar em contato com o mentor"
                  : "Confira as informações completas do mentor selecionado"
                }
              </DialogDescription>
            </DialogHeader>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-white"
            >
              <X className="h-5 w-5" />

            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-impulso-light/20 scrollbar-track-transparent hover:scrollbar-thumb-impulso-light/40" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            {!showForm ? (
              /* Mentor Details */
              <div className="p-6 space-y-6">
                {/* Photo and Basic Info */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  </div>
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

                {/* Experience and Education Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Experience */}
                  {mentor.experiencia_profissional && (
                    <div>
                      <h4 className="font-semibold text-impulso-dark mb-2">Experiência Profissional</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{mentor.experiencia_profissional}</p>
                    </div>
                  )}

                  {/* Education */}
                  {mentor.formacao_academica && (
                    <div>
                      <h4 className="font-semibold text-impulso-dark mb-2">Formação Acadêmica</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{mentor.formacao_academica}</p>
                    </div>
                  )}
                </div>

                {/* Specialties */}
                {mentor.especialidades && mentor.especialidades.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-impulso-dark mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.especialidades.map((especialidade, index) => (
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
                {mentor.tags && mentor.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-impulso-dark mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.tags.map((tag, index) => (
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
                        <div className="flex items-center space-x-3 bg-gradient-to-r from-[#10CA7B]/10 to-[#11AE5E]/5 rounded-lg p-4 border border-[#10CA7B]/20 hover:border-[#10CA7B]/40 transition-all duration-300">
                          <div className="bg-impulso-light/20 rounded-full p-2">
                            <Calendar className="w-5 h-5 text-impulso-dark" />
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
                        <div className="flex items-center space-x-3 bg-gradient-to-r from-[#10CA7B]/10 to-[#11AE5E]/5 rounded-lg p-4 border border-[#10CA7B]/20 hover:border-[#10CA7B]/40 transition-all duration-300">
                          <div className="bg-impulso-light/20 rounded-full p-2">
                            <Calendar className="w-5 h-5 text-impulso-dark" />
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
                        <div className="flex items-center space-x-3 bg-gradient-to-r from-[#10CA7B]/10 to-[#11AE5E]/5 rounded-lg p-4 border border-[#10CA7B]/20 hover:border-[#10CA7B]/40 transition-all duration-300">
                          <div className="bg-impulso-light/20 rounded-full p-2">
                            <Calendar className="w-5 h-5 text-impulso-dark" />
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
            ) : (
                             /* User Form */
               <div className="p-6">
                 <form onSubmit={handleSubmit} className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="nome_usuario" className="text-impulso-dark font-medium">
                         <User className="w-4 h-4 inline mr-1" />
                         Nome Completo *
                       </Label>
                       <Input
                         id="nome_usuario"
                         name="nome_usuario"
                         type="text"
                         value={formData.nome_usuario}
                         onChange={handleInputChange}
                         placeholder="Digite seu nome completo"
                         className="border-impulso-light/30 focus:border-impulso-light"
                         required
                       />
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="email_usuario" className="text-impulso-dark font-medium">
                         <Mail className="w-4 h-4 inline mr-1" />
                         Email *
                       </Label>
                       <Input
                         id="email_usuario"
                         name="email_usuario"
                         type="email"
                         value={formData.email_usuario}
                         onChange={handleInputChange}
                         placeholder="Digite seu email"
                         className="border-impulso-light/30 focus:border-impulso-light"
                         required
                       />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="telefone_usuario" className="text-impulso-dark font-medium">
                       <Phone className="w-4 h-4 inline mr-1" />
                       Telefone *
                     </Label>
                     <Input
                       id="telefone_usuario"
                       name="telefone_usuario"
                       type="tel"
                       value={formData.telefone_usuario}
                       onChange={handleInputChange}
                       placeholder="(11) 99999-9999"
                       className="border-impulso-light/30 focus:border-impulso-light"
                       maxLength={15}
                       required
                     />
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivo" className="text-impulso-dark font-medium">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Motivo da Mentoria
                    </Label>
                    <Textarea
                      id="motivo"
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleInputChange}
                      placeholder="Descreva brevemente por que escolheu este mentor e o que espera da mentoria..."
                      className="border-impulso-light/30 focus:border-impulso-light min-h-[100px]"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agenda" className="text-impulso-dark font-medium">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Agenda *
                    </Label>
                    <Select
                      value={formData.agenda}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, agenda: value }))}
                    >
                      <SelectTrigger className="border-impulso-light/30 focus:border-impulso-light">
                        <SelectValue placeholder="Selecione uma opção de agenda" />
                      </SelectTrigger>
                      <SelectContent>
                        {mentor.opcao_agenda_um && (
                          <SelectItem value={mentor.opcao_agenda_um}>
                            Opção 1: {formatarDataHoraBrasileira(mentor.opcao_agenda_um)}
                          </SelectItem>
                        )}
                        {mentor.opcao_agenda_dois && (
                          <SelectItem value={mentor.opcao_agenda_dois}>
                            Opção 2: {formatarDataHoraBrasileira(mentor.opcao_agenda_dois)}
                          </SelectItem>
                        )}
                        {mentor.opcao_agenda_tres && (
                          <SelectItem value={mentor.opcao_agenda_tres}>
                            Opção 3: {formatarDataHoraBrasileira(mentor.opcao_agenda_tres)}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="border-impulso-light/30 text-impulso-light hover:bg-impulso-light hover:text-impulso-dark"
                    >
                      Voltar
                    </Button>
                                         <Button
                       type="submit"
                       disabled={isSubmitting}
                       className="bg-impulso-dark hover:bg-impulso-light text-white"
                     >
                      {isSubmitting ? "Enviando..." : "Confirmar Escolha"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          {!showForm && (
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-impulso-light/30 text-impulso-light hover:bg-impulso-light hover:text-impulso-dark"
                >
                  Fechar
                </Button>
                                  <Button
                    onClick={() => setShowForm(true)}
                    disabled={!mentor.disponivel}
                    className={`${
                      mentor.disponivel
                        ? "bg-impulso-dark hover:bg-impulso-light text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                  {mentor.disponivel ? "Selecionar Mentor" : "Não Disponível"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
