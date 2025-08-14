import { Request, Response } from "express";
import {
  createFriendRequestService,
  getFriendByFullNameOrUsernameService,
  processFriendRequestService,
} from "../services/friends.service";
import { getPendingFriendRequestByReceiverIdService } from "../services/friend_request.service";

export const getFriendByFullNameController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name = "" } = req.query;

    if (!name) {
      res.status(400).json({ error: "query param name is required" });
      return;
    }

    const friends = await getFriendByFullNameOrUsernameService(`${name}`);

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

export const sendRequestFriendshipController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) throw new Error("User not authenticated");

    if (!req.body.friendId)
      throw new Error("friendId is required in the request body");

    const friends = await createFriendRequestService(
      user.id,
      req.body.friendId
    );

    res.status(200).json({ friends });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: error.message || "Error fetching sendRequestFriendship",
    });
  }
};

export const updateStatusFriendController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;
    if (!user) throw new Error("User not authenticated");

    const friendRequest = await processFriendRequestService({
      id_friend_request: req.body.id_friend_request,
      status: req.body.status,
      user_id: user.id,
    });

    res.status(200).json({
      ok: true,
      message: "Friend request accepted",
      data: friendRequest,
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: error.message || "Error fetching acceptFriendship",
    });
  }
};

export const getPendingFriendRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const pendingFriendRequests =
      await getPendingFriendRequestByReceiverIdService(req.user!.id);

    return res.status(200).json({
      ok: true,
      message: "Pending friend requests fetched successfully",
      data: pendingFriendRequests,
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error.message || "Error fetching pending friend requests",
    });
  }
};
