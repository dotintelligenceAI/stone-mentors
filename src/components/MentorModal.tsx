
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mentor } from '../types/mentor';
import { submitMentorChoice, updateMentorAvailability } from '../utils/supabaseService';
import { toast } from '@/hooks/use-toast';
import { User, Mail, MessageSquare } from 'lucide-react';

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
    motivo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      // Submit the choice to the submissions table
      await submitMentorChoice({
        mentor_id: mentor.id!,
        nome_usuario: formData.nome_usuario,
        email_usuario: formData.email_usuario,
        motivo: formData.motivo,
      });

      // Update mentor availability to false
      await updateMentorAvailability(mentor.id!, false);

      toast({
        title: "Sucesso!",
        description: `Você escolheu ${mentor.nome} como seu mentor. Eles entrarão em contato em breve!`,
      });

      setFormData({ nome_usuario: '', email_usuario: '', motivo: '' });
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
      <DialogContent className="sm:max-w-md bg-white border-2 border-[#11AC5C]/20">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#014837] to-[#11AC5C] bg-clip-text text-transparent">
            Escolha Seu Mentor
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Selected Mentor Info */}
          <div className="bg-gradient-to-r from-[#11AC5C]/10 to-[#0FCC7D]/10 rounded-lg p-6 text-center border border-[#11AC5C]/20">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-[#11AC5C]/30 shadow-lg">
              <img
                src={mentor.foto_url || "/placeholder.svg"}
                alt={mentor.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <h3 className="font-bold text-xl text-[#014837] mb-1">{mentor.nome}</h3>
            <p className="text-sm font-medium text-[#11AC5C]">{mentor.setor}</p>
          </div>

          {/* Form */}
          <div className="border-t border-[#11AC5C]/20 pt-6">
            <div className="mb-4 text-center">
              <span className="text-sm font-semibold text-[#014837] bg-gradient-to-r from-[#11AC5C]/10 to-[#0FCC7D]/10 px-3 py-1 rounded-full">
                📝 Preencha seus dados
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome_usuario" className="flex items-center text-[#014837] font-semibold">
                <User className="w-4 h-4 mr-2 text-[#11AC5C]" />
                Nome Completo *
              </Label>
              <Input
                id="nome_usuario"
                name="nome_usuario"
                type="text"
                value={formData.nome_usuario}
                onChange={handleInputChange}
                placeholder="Digite seu nome completo"
                className="border-[#11AC5C]/30 focus:border-[#11AC5C] focus:ring-[#11AC5C]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_usuario" className="flex items-center text-[#014837] font-semibold">
                <Mail className="w-4 h-4 mr-2 text-[#11AC5C]" />
                Email *
              </Label>
              <Input
                id="email_usuario"
                name="email_usuario"
                type="email"
                value={formData.email_usuario}
                onChange={handleInputChange}
                placeholder="Digite seu email"
                className="border-[#11AC5C]/30 focus:border-[#11AC5C] focus:ring-[#11AC5C]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo" className="flex items-center text-[#014837] font-semibold">
                <MessageSquare className="w-4 h-4 mr-2 text-[#11AC5C]" />
                Motivo da Mentoria (opcional)
              </Label>
              <Textarea
                id="motivo"
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                placeholder="Conte-nos porque você escolheu este mentor..."
                className="border-[#11AC5C]/30 focus:border-[#11AC5C] focus:ring-[#11AC5C]/20"
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[#11AC5C]/40 text-[#014837] hover:bg-[#11AC5C]/10 hover:border-[#11AC5C] transition-all duration-300"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#11AC5C] to-[#0FCC7D] hover:from-[#014837] hover:to-[#11AC5C] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Confirmar Seleção'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
