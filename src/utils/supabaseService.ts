import { supabase } from '@/integrations/supabase/client';
import { Mentor, MentorSubmission } from '../types/mentor';

export const fetchMentors = async (): Promise<Mentor[]> => {
  const { data, error } = await supabase
    .from('mentores')
    .select('*')
    .order('nome');

  if (error) {
    console.error('Error fetching mentors:', error);
    throw error;
  }

  // Convert the database format to our Mentor interface
  const mentors: Mentor[] = (data || []).map((mentor: any) => ({
    id: mentor.id,
    nome: mentor.nome,
    email: mentor.email || '',
    telefone: mentor.telefone || '',
    cidade: mentor.cidade || '',
    cargo_atual: mentor.cargo_atual || '',
    empresa_atual: mentor.empresa_atual || '',
    setor: mentor.setor || '',
    tags: Array.isArray(mentor.tags) ? mentor.tags : mentor.setor ? [mentor.setor] : [],
    descricao: mentor.descricao || '',
    experiencia_profissional: mentor.experiencia_profissional || '',
    formacao_academica: mentor.formacao_academica || '',
    especialidades: Array.isArray(mentor.especialidades) 
      ? mentor.especialidades 
      : mentor.setor 
        ? [mentor.setor] 
        : [],
    disponibilidade: mentor.disponibilidade || '',
    disponivel: mentor.disponivel !== undefined ? Boolean(mentor.disponivel) : true,
    foto_url: mentor.foto_url || '',
    created_at: mentor.criado_em || mentor.created_at || new Date().toISOString(),
    updated_at: mentor.atualizado_em || mentor.updated_at || new Date().toISOString()
  }));

  return mentors;
};

export const submitMentorChoice = async (submission: MentorSubmission): Promise<void> => {
  const { error } = await supabase
    .from('mentor_submissions')
    .insert({
      mentor_id: submission.mentor_id,
      nome_usuario: submission.nome_usuario,
      email_usuario: submission.email_usuario,
      telefone_usuario: submission.telefone_usuario,
      motivo: submission.motivo,
      data_submissao: new Date().toISOString()
    });

  if (error) {
    console.error('Error submitting mentor choice:', error);
    throw error;
  }
};

export const updateMentorAvailability = async (mentorId: string, disponivel: boolean): Promise<void> => {
  const { error } = await supabase
    .from('mentores')
    .update({ disponivel })
    .eq('id', mentorId);

  if (error) {
    console.error('Error updating mentor availability:', error);
    throw error;
  }
};

export const fetchMentorSubmissions = async () => {
  const { data, error } = await supabase
    .from('mentor_submissions')
    .select(`
      *,
      mentores (
        nome,
        setor,
        foto_url
      )
    `)
    .order('data_submissao', { ascending: false });

  if (error) {
    console.error('Error fetching mentor submissions:', error);
    throw error;
  }

  return data || [];
};
