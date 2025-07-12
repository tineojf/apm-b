import { Request, Response } from "express";
import {
  getCitationService,
  createPrayerService,
} from "../services/openaiService";

export const citationController = async (_req: Request, res: Response) => {
  try {
    const citation = await getCitationService();
    res.json({ citation });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch citation" });
  }
};

export const prayerController = async (req: Request, res: Response) => {
  const { answer } = req.body;

  const allowedValues = ["bad", "good", "neutral"];

  if (!answer) {
    res.status(400).json({ error: "Answer is required" });
    return;
  }

  if (!allowedValues.includes(answer)) {
    res
      .status(400)
      .json({ error: "Answer must be 'bad', 'good', or 'neutral'" });
    return;
  }

  try {
    const prayer = await createPrayerService(answer);
    res.json({ prayer });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate prayer" });
  }
};
