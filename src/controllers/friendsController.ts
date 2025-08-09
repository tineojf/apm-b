import { Request, Response } from "express";
import { getFriendByFullNameService } from "../services/friends.service";

export const getFriendByFullNameController = async (
  req: Request,
  res: Response
) => {
  try {
    const { fullName = "" } = req.query;

    if (!fullName) {
      res.status(400).json({ error: "El fullName es obligatorio" });
      return;
    }

    const friends = await getFriendByFullNameService(`${fullName}`);

    res.status(200).json({ friends });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error fetching citation",
      citation: null,
      updatedAt: null,
    });
  }
};
