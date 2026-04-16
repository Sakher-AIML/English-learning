import { Button } from "@/components/ui/button";

export function RatingButtons() {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      <Button className="bg-danger text-white hover:bg-danger">Hard 😓</Button>
      <Button className="bg-secondary text-white hover:bg-secondary">Okay 🙂</Button>
      <Button className="bg-success text-white hover:bg-success">Easy 😄</Button>
    </div>
  );
}
