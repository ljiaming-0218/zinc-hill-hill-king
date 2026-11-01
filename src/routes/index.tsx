import { createFileRoute } from "@tanstack/react-router";
import { SpaceShooter } from "@/game/SpaceShooter";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SpaceShooter />;
}
