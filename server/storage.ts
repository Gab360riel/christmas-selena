import { messages, type Message, type InsertMessage } from "@shared/schema";

export interface IStorage {
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private messages: Message[] = [];
  private currentId = 1;

  constructor() {
    // Pre-populate with seed data for immediate frontend availability
    const seedMessages = [
      "Muita paz e alegria!",
      "Feliz Natal e próspero Ano Novo!",
      "Que a magia do Natal ilumine sua vida.",
      "Saúde, amor e sucesso!",
      "Boas festas e muitas realizações!",
      "Um ano novo cheio de esperança!",
      "Gratidão por tudo que passou.",
      "Acredite nos seus sonhos!",
      "O melhor presente é o amor.",
      "Sorria, é Natal!",
      "Espalhe luz por onde for.",
      "Viva cada momento com intensidade."
    ];
    
    seedMessages.forEach(content => {
      this.messages.push({ id: this.currentId++, content });
    });
  }

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = { ...insertMessage, id: this.currentId++ };
    this.messages.push(message);
    return message;
  }
}

export const storage = new MemStorage();
