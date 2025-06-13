interface WhatsAppMessageData {
  number: string | number;
  text: string;
}

interface MentorNotificationData {
  mentorNome: string;
  mentorTelefone: string | number;
  empreendedorNome: string;
  empreendedorTelefone: string | number;
  empreendedorEmail: string;
}

interface UserNotificationData {
  empreendedorNome: string;
  empreendedorTelefone: string | number;
  mentorNome: string;
}

const API_URL = 'https://evolution.amcbots.com.br/message/sendText/stone';
const API_KEY = '8082C8745C8C-4E48-A883-8ED396DA3C09';

// Função para formatar número de telefone brasileiro
const formatBrazilianNumber = (phoneNumber: string | number | undefined | null): string => {
  // Verificar se o telefone é válido
  if (!phoneNumber) {
    console.error('Invalid phone number:', phoneNumber, typeof phoneNumber);
    throw new Error(`Número de telefone inválido: ${phoneNumber}`);
  }
  
  // Converter para string se for number
  const phoneStr = String(phoneNumber);
  
  // Remove todos os caracteres não numéricos
  const cleaned = phoneStr.replace(/\D/g, '');
  
  console.log('formatBrazilianNumber input:', phoneNumber);
  console.log('formatBrazilianNumber phoneStr:', phoneStr);
  console.log('formatBrazilianNumber cleaned:', cleaned);
  
  // Se não tem código do país, adiciona +55
  if (cleaned.length === 11 && cleaned.startsWith('11')) {
    return `55${cleaned}`;
  } else if (cleaned.length === 11) {
    return `55${cleaned}`;
  } else if (cleaned.length === 10) {
    return `55${cleaned}`;
  } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
    return cleaned;
  } else if (cleaned.length === 12 && !cleaned.startsWith('55')) {
    return `55${cleaned}`;
  }
  
  // Fallback: retorna o número limpo
  return cleaned;
};

const sendWhatsAppMessage = async (data: WhatsAppMessageData): Promise<void> => {
  try {
    const formattedNumber = formatBrazilianNumber(data.number);
    
    const payload = {
      number: formattedNumber,
      text: data.text
    };

    console.log('Sending WhatsApp message:', payload);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('WhatsApp API error response:', result);
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText} - ${JSON.stringify(result)}`);
    }

    console.log('WhatsApp message sent successfully:', result);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

export const sendMentorNotification = async (data: MentorNotificationData): Promise<void> => {
  console.log('sendMentorNotification data:', data);
  
  // Validar se os telefones são válidos
  if (!data.mentorTelefone) {
    console.error('Invalid mentor phone:', data.mentorTelefone);
    throw new Error(`Telefone do mentor inválido: ${data.mentorTelefone}`);
  }
  
  if (!data.empreendedorTelefone) {
    console.error('Invalid user phone:', data.empreendedorTelefone);
    throw new Error(`Telefone do empreendedor inválido: ${data.empreendedorTelefone}`);
  }
  
  const message = `Oi, ${data.mentorNome}!
Temos um match confirmado: o(a) empreendedor(a) ${data.empreendedorNome} escolheu você como mentor(a) no Programa Impulso!

Aqui estão os dados de contato:
📞 Telefone: ${data.empreendedorTelefone}
📧 E-mail: ${data.empreendedorEmail}

Agora é com você: entre em contato com o(a) ${data.empreendedorNome} pra alinhar o dia, o horário e os próximos passos da mentoria individual.

Seu apoio vai fazer toda a diferença — e o(a) empreendedor(a) já tá esperando esse encontro com você.

Obrigado por caminhar com a gente nessa jornada! Qualquer dúvida, conte com a gente.`;

  await sendWhatsAppMessage({
    number: data.mentorTelefone,
    text: message,
  });
};

export const sendUserNotification = async (data: UserNotificationData): Promise<void> => {
  console.log('sendUserNotification data:', data);
  
  // Validar se o telefone é válido
  if (!data.empreendedorTelefone) {
    console.error('Invalid user phone:', data.empreendedorTelefone);
    throw new Error(`Telefone do empreendedor inválido: ${data.empreendedorTelefone}`);
  }
  
  const message = `Oi, ${data.empreendedorNome}! Tudo certo?
Você escolheu sua mentoria — e a conexão foi feita com sucesso!

Agora é só aguardar: em breve, ${data.mentorNome} vai entrar em contato com você pra combinar o dia e horário da mentoria individual.

Esse será um momento de troca, escuta e apoio feito pra te ajudar com o que você mais precisa no seu negócio.

Fica de olho no celular - tá chegando coisa boa!

Qualquer dúvida, estamos aqui.`;

  await sendWhatsAppMessage({
    number: data.empreendedorTelefone,
    text: message,
  });
}; 