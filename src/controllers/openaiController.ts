import { Request, Response } from "express";
import {
  createPrayerFromAnswer,
  getRandomBibleCitation,
} from "../services/openaiService";

export const citationController = async (_req: Request, res: Response) => {
  try {
    const citation = await getRandomBibleCitation();
    res.json({ citation });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch citation" });
  }
};

export const prayerController = async (req: Request, res: Response) => {
  const { answer } = req.body;

  if (!answer) {
    res.status(400).json({ error: "Answer is required" });
  }

  try {
    const prayer = await createPrayerFromAnswer(answer);
    res.json({ prayer });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate prayer" });
  }
};
