import Button from "@/components/Button/Button";

export default function Home() {
  return (
    <main className="min-h-screen space-y-4 p-8">
      <h1 className="text-3xl font-bold">Component Library</h1>

      <div className="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>

        <Button variant="secondary">Secondary</Button>

        <Button variant="danger">Danger</Button>

        <Button variant="primary" loading>
          Save
        </Button>
      </div>
    </main>
  );
}