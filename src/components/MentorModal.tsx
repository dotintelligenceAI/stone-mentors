import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mentor } from '../types/mentor';
import { submitMentorChoice, updateMentorAvailability } from '../utils/supabaseService';
import { toast } from '@/hooks/use-toast';
import { User, Mail, MessageSquare, Phone, X, MapPin, Briefcase, Clock, Tag } from 'lucide-react';
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mentor) return;
    
    if (!formData.nome_usuario || !formData.email_usuario) {
      toast({
        title: "Informações Obrigatórias",
        description: "Por favor, preencha nome e email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting mentor choice:', { mentor: mentor.nome, formData });
      
      await submitMentorChoice({
        mentor_id: mentor.id!,
        nome_usuario: formData.nome_usuario,
        email_usuario: formData.email_usuario,
        telefone_usuario: formData.telefone_usuario,
        motivo: formData.motivo,
      });

      await updateMentorAvailability(mentor.id!, false);

      toast({
        title: "Sucesso!",
        description: `Você escolheu ${mentor.nome} como seu mentor. Eles entrarão em contato em breve!`,
      });

      setFormData({ nome_usuario: '', email_usuario: '', telefone_usuario: '', motivo: '' });
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
                    {mentor.disponibilidade && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-impulso-light" />
                        <span className="text-gray-600">Horário: {mentor.disponibilidade}</span>
                      </div>
                    )}
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
                          className="bg-impulso-light text-white hover:bg-impulso-dark transition-all duration-300 text-xs font-medium"
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
                          variant="outline"
                          className="text-impulso-light border-impulso-light/40 hover:bg-impulso-light/10 transition-all duration-300 text-xs font-medium"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
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
                       Telefone
                     </Label>
                     <Input
                       id="telefone_usuario"
                       name="telefone_usuario"
                       type="tel"
                       value={formData.telefone_usuario}
                       onChange={handleInputChange}
                       placeholder="Digite seu telefone"
                       className="border-impulso-light/30 focus:border-impulso-light"
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
