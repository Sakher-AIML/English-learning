import { PhonemeBreakdown } from "@/components/pronunciation/PhonemeBreakdown";
import { RecordButton } from "@/components/pronunciation/RecordButton";
import { ScoreRing } from "@/components/pronunciation/ScoreRing";
import { WaveformDisplay } from "@/components/pronunciation/WaveformDisplay";

export default function PronunciationPage() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 text-center">
      <h1 className="text-3xl font-extrabold">Pronunciation Practice</h1>
      <p className="rounded-2xl border bg-surface-2 px-4 py-6 text-xl font-semibold">
        &quot;Could you tell me where the nearest station is?&quot;
      </p>

      <div className="flex items-center justify-center gap-6">
        <RecordButton isRecording={false} />
        <ScoreRing score={78} />
      </div>

      <WaveformDisplay />
      <PhonemeBreakdown
        items={[
          { word: "Could", correct: true },
          { word: "nearest", correct: false, phonemeTip: "Stretch the 'ea' vowel" },
          { word: "station", correct: true },
        ]}
      />
    </section>
  );
}
