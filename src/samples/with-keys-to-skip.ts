import { createSample } from "./create-sample";

export const withKeysToSkip = createSample({
  source: {
    mission: "Rescue Princess",
    status: "In Progress",
    characters: [
      {
        id: "LUKE_SKYWALKER",
        name: "Luke Skywalker",
        role: "Farm Boy",
        forceTraining: false,
        metadata: { updatedAt: "2025-01-01" },
      },
      {
        id: "LEIA_ORGANA",
        name: "Princess Leia",
        role: "Prisoner",
        forceTraining: false,
        metadata: { updatedAt: "2025-01-02" },
      },
    ],
  },
  target: {
    mission: "Destroy Death Star",
    status: "Complete",
    characters: [
      {
        id: "LUKE_SKYWALKER",
        name: "Luke Skywalker",
        role: "Pilot",
        forceTraining: true,
        rank: "Commander",
        metadata: { updatedAt: "2025-01-03" },
      },
      {
        id: "HAN_SOLO",
        name: "Han Solo",
        role: "Smuggler",
        forceTraining: false,
        ship: "Millennium Falcon",
        metadata: { updatedAt: "2025-01-04" },
      },
    ],
  },
  diffOptions: {
    keysToSkip: ["characters.metadata"],
  },
});
