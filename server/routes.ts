import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.messages.list.path, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  // Seed data if empty
  const existing = await storage.getMessages();
  if (existing.length === 0) {
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
    
    for (const content of seedMessages) {
      await storage.createMessage({ content });
    }
  }

  return httpServer;
}
