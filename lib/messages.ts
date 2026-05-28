export type DirectMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  sentAt: string;
};

export type Conversation = {
  friendId: string;
  messages: DirectMessage[];
};

export const conversations: Conversation[] = [
  {
    friendId: "p1", // Félix Lebrun
    messages: [
      {
        id: "msg1",
        senderId: "p1",
        receiverId: "p5",
        text: "Salut Léon, prêt pour l'entraînement de ce soir ?",
        sentAt: "2026-05-27T18:00:00Z",
      },
      {
        id: "msg2",
        senderId: "p5",
        receiverId: "p1",
        text: "Yes, je suis chaud ! On travaille le service ?",
        sentAt: "2026-05-27T18:05:00Z",
      },
    ],
  },
  {
    friendId: "p6", // Marie Dubois
    messages: [
      {
        id: "msg3",
        senderId: "p5",
        receiverId: "p6",
        text: "Bien joué pour ton dernier match !",
        sentAt: "2026-05-26T20:10:00Z",
      },
      {
        id: "msg4",
        senderId: "p6",
        receiverId: "p5",
        text: "Merci ! On se fait un amical bientôt ?",
        sentAt: "2026-05-26T20:15:00Z",
      },
      {
        id: "msg5",
        senderId: "p5",
        receiverId: "p6",
        text: "Carrément, ce week-end ça te dit ?",
        sentAt: "2026-05-26T20:20:00Z",
      },
    ],
  },
  {
    friendId: "p2", // Alexis Lebrun
    messages: [
      {
        id: "msg6",
        senderId: "p2",
        receiverId: "p5",
        text: "Tu viens au tournoi de Paris 13 le mois prochain ?",
        sentAt: "2026-05-25T14:00:00Z",
      },
    ],
  },
];

export function getConversation(friendId: string): Conversation | undefined {
  return conversations.find((c) => c.friendId === friendId);
}

export function getAllConversations(): Conversation[] {
  return conversations.sort((a, b) => {
    const lastMsgA = a.messages[a.messages.length - 1];
    const lastMsgB = b.messages[b.messages.length - 1];
    return new Date(lastMsgB.sentAt).getTime() - new Date(lastMsgA.sentAt).getTime();
  });
}
