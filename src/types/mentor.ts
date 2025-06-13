export interface Mentor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade?: string;
  cargo_atual: string;
  empresa_atual: string;
  setor?: string;
  tags?: string[];
  descricao?: string;
  experiencia_profissional: string;
  formacao_academica: string;
  especialidades: string[];
  disponibilidade?: string;
  disponivel: boolean;
  foto_url?: string;
  opcao_agenda_um?: string;
  opcao_agenda_dois?: string;
  opcao_agenda_tres?: string;
  created_at: string;
  updated_at: string;
}

export interface MentorSubmission {
  id?: string;
  mentor_id: string;
  nome_usuario: string;
  email_usuario: string;
  telefone_usuario: string;
  motivo?: string;
  agenda?: string;
  data_submissao?: string;
}
