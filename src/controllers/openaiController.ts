import { Request, Response } from "express";
import {
  getCitationService,
  createPrayerService,
} from "../services/openaiService";

export const citationController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const citation = await getCitationService();

    res.status(200).json({
      ok: true,
      message: "Citation fetched successfully",
      citation: citation.phrase,
      updatedAt: citation.updated_at,
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error fetching citation",
      citation: null,
      updatedAt: null,
    });
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
