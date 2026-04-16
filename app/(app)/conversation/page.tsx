import { ChatInput } from "@/components/conversation/ChatInput";
import { ChatMessage } from "@/components/conversation/ChatMessage";
import { TopicSelector } from "@/components/conversation/TopicSelector";

export default function ConversationPage() {
  return (
    <section className="flex min-h-[70vh] flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">AI Conversation</h1>
        <TopicSelector />
      </header>

      <div className="surface-card flex-1 space-y-3 p-4">
        <ChatMessage role="assistant" text="Hi! Let&apos;s practice ordering coffee. What would you like today?" />
        <ChatMessage
          role="user"
          text="I want one cappuccino and croissant please."
          correction="I would like a cappuccino and a croissant, please."
        />
      </div>

      <ChatInput />
    </section>
  );
}
