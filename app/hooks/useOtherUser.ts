//To fetch the name of the other user with whom we are chatting

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

export default function useOtherUser(
  conversation: FullConversationType | { users: User[] }
) {
  const session = useSession();
  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;
    const otherUser = conversation.users.filter(
      (user) => user.email != currentUserEmail
    );
    return otherUser[0]; //instead of returing whole array return only one
  }, [session?.data?.user?.email, conversation.users]);
  return otherUser;
}
