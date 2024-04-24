import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (currentUser?.id || currentUser?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new Response("Invalid Data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              //iterate over the members and we use members id to connect users
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser?.id,
              },
            ],
          },
        },
        //it populates the users when we fetch the conversation. (By default we only get users ID but we want other details also so we used include users )
        include: {
          users: true,
        },
      });
      return NextResponse.json(newConversation);
    }

    //To check existing one to one conversation with person.
    //If exists, we will continue and not create the new conversation.
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser?.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser?.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];
    //If exists, we will continue and not create the new conversation.
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    } else {
      const newConversation = await prisma.conversation.create({
        data: {
          users: {
            connect: [
              { id: currentUser?.id },
              {
                id: userId,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      return NextResponse.json(newConversation);
    }
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
