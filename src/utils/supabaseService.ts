import { supabase } from '@/integrations/supabase/client';
import { Mentor, MentorSubmission } from '../types/mentor';

// Função para limpar número de telefone (remove formatação)
const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
};

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
    nome: mentor.nome || '',
    email: mentor.email || '',
    telefone: mentor.telefone || '',
    cidade: mentor.cidade || '',
    cargo_atual: mentor.cargo_atual || '',
    empresa_atual: mentor.empresa_atual || '',
    setor: mentor.setor || '',
    tags: Array.isArray(mentor.tags) ? mentor.tags : (mentor.tags ? [mentor.tags] : []),
    descricao: mentor.descricao || '',
    experiencia_profissional: mentor.experiencia_profissional || '',
    formacao_academica: mentor.formacao_academica || '',
    especialidades: Array.isArray(mentor.especialidades) 
      ? mentor.especialidades 
      : (mentor.especialidades ? [mentor.especialidades] : []),
    disponibilidade: mentor.disponibilidade || 'Consultar',
    disponivel: mentor.disponivel !== undefined ? Boolean(mentor.disponivel) : true,
    foto_url: mentor.foto_url || '',
    opcao_agenda_um: mentor.opcao_agenda_um || '',
    opcao_agenda_dois: mentor.opcao_agenda_dois || '',
    opcao_agenda_tres: mentor.opcao_agenda_tres || '',
    created_at: mentor.created_at || new Date().toISOString(),
    updated_at: mentor.updated_at || new Date().toISOString()
  }));

  return mentors;
};

export const fetchMentorsByArea = async (area: string): Promise<Mentor[]> => {
  const { data, error } = await supabase
    .from('mentores')
    .select('*')
    .ilike('setor', `%${area}%`)
    .eq('disponivel', true)
    .order('nome');

  if (error) {
    console.error('Error fetching mentors by area:', error);
    throw error;
  }

  // Convert the database format to our Mentor interface
  const mentors: Mentor[] = (data || []).map((mentor: any) => ({
    id: mentor.id,
    nome: mentor.nome || '',
    email: mentor.email || '',
    telefone: mentor.telefone || '',
    cidade: mentor.cidade || '',
    cargo_atual: mentor.cargo_atual || '',
    empresa_atual: mentor.empresa_atual || '',
    setor: mentor.setor || '',
    tags: Array.isArray(mentor.tags) ? mentor.tags : (mentor.tags ? [mentor.tags] : []),
    descricao: mentor.descricao || '',
    experiencia_profissional: mentor.experiencia_profissional || '',
    formacao_academica: mentor.formacao_academica || '',
    especialidades: Array.isArray(mentor.especialidades) 
      ? mentor.especialidades 
      : (mentor.especialidades ? [mentor.especialidades] : []),
    disponibilidade: mentor.disponibilidade || 'Consultar',
    disponivel: Boolean(mentor.disponivel),
    foto_url: mentor.foto_url || '',
    opcao_agenda_um: mentor.opcao_agenda_um || '',
    opcao_agenda_dois: mentor.opcao_agenda_dois || '',
    opcao_agenda_tres: mentor.opcao_agenda_tres || '',
    created_at: mentor.created_at || new Date().toISOString(),
    updated_at: mentor.updated_at || new Date().toISOString()
  }));

  return mentors;
};

export const submitMentorChoice = async (submission: MentorSubmission): Promise<void> => {
  // Limpar o telefone removendo formatação para inserir no banco
  const cleanedPhone = cleanPhoneNumber(submission.telefone_usuario);
  
  console.log('Original phone:', submission.telefone_usuario);
  console.log('Cleaned phone:', cleanedPhone);
  console.log('Cleaned phone length:', cleanedPhone.length);
  console.log('Cleaned phone type:', typeof cleanedPhone);
  
  // Validar se o telefone limpo é válido
  if (!cleanedPhone || cleanedPhone.length < 10) {
    throw new Error(`Telefone inválido: ${submission.telefone_usuario}`);
  }
  
  const submissionData = {
    mentor_id: submission.mentor_id,
    nome_usuario: submission.nome_usuario,
    email_usuario: submission.email_usuario,
    telefone_usuario: cleanedPhone, // Usar telefone limpo
    motivo: submission.motivo,
    agenda: submission.agenda,
    data_submissao: new Date().toISOString()
  };
  
  console.log('Submission data:', submissionData);
  
  const { error } = await supabase
    .from('mentor_submissions')
    .insert(submissionData);

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

export const fetchMentorsByFilters = async (keywords: string[]): Promise<Mentor[]> => {
  try {
    let query = supabase
      .from('mentores')
      .select('*')
      .eq('disponivel', true);

    // Criar filtros para setor, tags e especialidades
    if (keywords.length > 0) {
      const orConditions = keywords.map(keyword => {
        const lowerKeyword = keyword.toLowerCase();
        return [
          `setor.ilike.%${lowerKeyword}%`,
          `tags.cs.{${lowerKeyword}}`,
          `especialidades.cs.{${lowerKeyword}}`
        ].join(',');
      }).join(',');

      query = query.or(orConditions);
    }

    const { data, error } = await query.order('nome');

    if (error) {
      console.error('Error fetching mentors by filters:', error);
      throw error;
    }

    // Convert the database format to our Mentor interface
    const mentors: Mentor[] = (data || []).map((mentor: any) => ({
      id: mentor.id,
      nome: mentor.nome || '',
      email: mentor.email || '',
      telefone: mentor.telefone || '',
      cidade: mentor.cidade || '',
      cargo_atual: mentor.cargo_atual || '',
      empresa_atual: mentor.empresa_atual || '',
      setor: mentor.setor || '',
      tags: Array.isArray(mentor.tags) ? mentor.tags : (mentor.tags ? [mentor.tags] : []),
      descricao: mentor.descricao || '',
      experiencia_profissional: mentor.experiencia_profissional || '',
      formacao_academica: mentor.formacao_academica || '',
      especialidades: Array.isArray(mentor.especialidades) 
        ? mentor.especialidades 
        : (mentor.especialidades ? [mentor.especialidades] : []),
      disponibilidade: mentor.disponibilidade || 'Consultar',
      disponivel: Boolean(mentor.disponivel),
      foto_url: mentor.foto_url || '',
      opcao_agenda_um: mentor.opcao_agenda_um || '',
      opcao_agenda_dois: mentor.opcao_agenda_dois || '',
      opcao_agenda_tres: mentor.opcao_agenda_tres || '',
      created_at: mentor.created_at || new Date().toISOString(),
      updated_at: mentor.updated_at || new Date().toISOString()
    }));

    return mentors;
  } catch (error) {
    console.error('Error in fetchMentorsByFilters:', error);
    return [];
  }
};
