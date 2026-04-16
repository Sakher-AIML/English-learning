import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  text: string;
  correction?: string;
}

export function ChatMessage({ role, text, correction }: ChatMessageProps) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-lg rounded-2xl px-4 py-3 text-sm",
          role === "user" ? "bg-primary text-white" : "border bg-white text-text-1",
        )}
      >
        <p>{text}</p>
        {correction && (
          <p className="mt-2 text-xs text-success">
            Suggested: <span className="font-semibold">{correction}</span>
          </p>
        )}
      </div>
    </div>
  );
}
