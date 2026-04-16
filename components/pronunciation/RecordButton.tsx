import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecordButton({ isRecording }: { isRecording: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-20 w-20 items-center justify-center rounded-full text-white shadow-soft",
        isRecording ? "animate-pulse bg-danger" : "bg-primary",
      )}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {isRecording ? <Square className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
    </button>
  );
}
