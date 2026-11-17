export const SITE = {
  name: "Dra. Helena Martins",
  role: "Psicóloga Clínica · CRP 06/123456",
  phone: "(11) 99999-0000",
  email: "contato@helenamartins.com.br",
  address: "Rua das Flores, 120 · São Paulo, SP",
  whatsapp: "5511999990000",
};

export const formatBRL = (v: number) =>
  Number(v) === 0 ? "Gratuito" : Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const TIMES = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
