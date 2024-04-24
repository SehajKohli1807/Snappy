import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";

interface IParams {
  conversationId: string;
}

export default async function ConversationId({ params }: { params: IParams }) {
  const conversation = getConversationById(params.conversationId);
  const messages = getMessages(params.conversationId);

  if (!conversation) {
  }
  return <div>ConversationId!</div>;
}
