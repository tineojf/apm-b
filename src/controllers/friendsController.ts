import { Request, Response } from "express";
import {
  createFriendRequestService,
  getAllFriendsWithStreakService,
  getFriendByFullNameOrUsernameService,
  processFriendRequestService,
} from "../services/friends.service";
import { getPendingFriendRequestByReceiverIdService } from "../services/friend_request.service";
import { CreateRequestFriendDTO } from "../validators/friend/createRequestFrienValidator";
import { createResponse } from "../utils/globalResponse";
import { ProcessRequestFriendDTO } from "../validators/friend/processRequestFriendValidator";

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

    res.status(200).json(createResponse({ data: friends }));
  } catch (error) {
    res.status(500).json(
      createResponse({
        message: "Error fetching friends",
        data: null,
        statusCode: 500,
        detail: error instanceof Error ? error.message : "Unknown error",
      })
    );
  }
};

export const getAllFriendsController = async (req: Request, res: Response) => {
  try {
    const friends = await getAllFriendsWithStreakService(req.user!.id);

    res.status(200).json(createResponse({ data: friends }));
  } catch (error) {
    res.status(500).json(
      createResponse({
        message: "Error fetching friends",
        data: null,
        statusCode: 500,
        detail: error instanceof Error ? error.message : "Unknown error",
      })
    );
  }
};

export const sendRequestFriendshipController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;
    const { profileId } = req.body as CreateRequestFriendDTO;

    if (!user) throw new Error("User not authenticated");

    const friends = await createFriendRequestService(user.id, profileId);

    res.status(200).json(createResponse({ data: friends }));
  } catch (error: any) {
    res.status(500).json(
      createResponse({
        message: "Error sending friend request",
        data: null,
        statusCode: 500,
        detail: error instanceof Error ? error.message : "Unknown error",
      })
    );
  }
};

export const updateStatusFriendController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;
    if (!user) throw new Error("User not authenticated");

    const { id_friend_request, status } = req.body as ProcessRequestFriendDTO;

    const friendRequest = await processFriendRequestService({
      id_friend_request,
      status,
      user_id: user.id,
    });

    res.status(200).json(createResponse({ data: friendRequest }));
  } catch (error: any) {
    console.log("error updateStatusFriendController->", error);

    res.status(500).json(
      createResponse({
        message: "Error updating friend request",
        data: null,
        statusCode: 500,
        detail: error instanceof Error ? error.message : "Unknown error",
      })
    );
  }
};

export const getPendingFriendRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const pendingFriendRequests =
      await getPendingFriendRequestByReceiverIdService(req.user!.id);

    return res
      .status(200)
      .json(createResponse({ data: pendingFriendRequests }));
  } catch (error: any) {
    return res.status(500).json(
      createResponse({
        message: "Error fetching pending friend requests",
        data: null,
        statusCode: 500,
        detail: error instanceof Error ? error.message : "Unknown error",
      })
    );
  }
};
