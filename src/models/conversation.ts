import mongoose, { Schema } from "mongoose";

interface MessageInterface {
  text: string;
  from: "user" | "admin";
}

export interface ConversationInterface {
  messages: MessageInterface[];
  createdAt: Date;
}

const conversationSchema = new Schema<ConversationInterface>({
  messages: [
    {
      text: String,
      from: String,
      createdAt: { type: Date, default: () => new Date() },
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
