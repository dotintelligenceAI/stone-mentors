
export interface Mentor {
  id?: string;
  nome: string;
  setor: string;
  descricao: string;
  tags: string;
  disponibilidade: string;
  foto_url: string;
  disponivel: boolean;
}

export interface MentorSubmission {
  id?: string;
  mentor_id: string;
  nome_usuario: string;
  email_usuario: string;
  motivo?: string;
  data_submissao?: string;
}
