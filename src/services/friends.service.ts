import { Profile } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";
import { getProfileService } from "./profileService";

export const getFriendByFullNameOrUsernameService = async (name: string) => {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .or(`full_name.ilike.%${name}%,username.ilike.%${name}%`);

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return data as Profile[];
};

export const createFriendRequestService = async (
  senderId: string,
  receiverId: string
) => {
  // 1. No enviarse a sí mismo
  if (senderId === receiverId) {
    throw new Error("You cannot send a friend request to yourself");
  }

  // 2. Receptor existe
  await getProfileService(receiverId);

  // 3. Ya son amigos
  const existingFriend = await getRelationFriends(senderId, receiverId);
  console.log("Existing friend", existingFriend);
  if (existingFriend) throw new Error("Friend already exists");

  // 4. Ya existe solicitud pendiente
  const existingRequest = await getFriendRequest(senderId, receiverId);
  console.log("Existing request", existingRequest);
  if (existingRequest) throw new Error("Ya existe una solicitud pendiente");

  // return existingRequest;

  // 5. Insertar nueva solicitud
  const { error } = await supabase
    .from("friend_requests")
    .insert({ sender_id: senderId, receiver_id: receiverId });

  if (error) throw new Error("DB: " + error.message);

  return {
    ok: true,
    message: "Friend request created successfully",
    data: null,
    dateTime: new Date().toISOString(),
    detail: "Friend request created successfully",
  };
};

const getRelationFriends = async (userId: string, friendId: string) => {
  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .eq("user_id", userId)
    .eq("friend_id", friendId)
    .maybeSingle();

  // if (error) throw new Error("DB getRelationFriends: " + error.message);

  return data;
};

const getFriendRequest = async (senderId: string, receiverId: string) => {
  const { data: existingRequest, error } = await supabase
    .from("friend_requests")
    .select("*")
    .or(
      `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
    )
    .eq("status", "pending")
    .maybeSingle();

  if (error) throw new Error("DB getFriendRequest: " + error.message);

  return existingRequest;
};
