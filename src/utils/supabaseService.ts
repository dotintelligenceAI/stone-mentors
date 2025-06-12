
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
  const mentors: Mentor[] = (data || []).map(mentor => ({
    id: mentor.id,
    nome: mentor.nome,
    setor: mentor.setor,
    descricao: mentor.descricao || '',
    tags: Array.isArray(mentor.tags) ? mentor.tags.join(', ') : (mentor.tags || ''),
    disponibilidade: mentor.disponibilidade || '',
    foto_url: mentor.foto_url || '',
    disponivel: mentor.disponivel || false
  }));

  return mentors;
};

export const submitMentorChoice = async (submission: Omit<MentorSubmission, 'id' | 'data_submissao'>): Promise<void> => {
  const { error } = await supabase
    .from('mentor_submissions')
    .insert([{
      ...submission,
      data_submissao: new Date().toISOString()
    }]);

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
