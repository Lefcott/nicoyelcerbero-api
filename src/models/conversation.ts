import mongoose, { Schema } from "mongoose";

interface MessageInterface {
  text: string;
  from: "user" | "admin";
  time: string;
}

export interface ConversationInterface {
  pageVisitId: string;
  messages: MessageInterface[];
  createdAt: Date;
}

const conversationSchema = new Schema<ConversationInterface>({
  pageVisitId: String,
  messages: [
    {
      text: String,
      from: String,
      time: String,
    },
  ],
  createdAt: { type: Date, default: () => new Date() },
});

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema,
  "conversations"
);

export default Conversation;
