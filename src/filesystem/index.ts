import dayjs from "dayjs";
import fs from "node:fs";
import { FightEvent } from "../types";

type SavedFightEvent = Omit<FightEvent, "time"> & { time: number };

const FILENAME = "fights.json";

export const readFights = (): FightEvent[] => {
  try {
    return JSON.parse(fs.readFileSync(`./${FILENAME}`, "utf8")).map(
      (event: SavedFightEvent) => ({ ...event, time: dayjs.unix(event.time) }),
    );
  } catch {
    return [];
  }
};

export const writeFights = (events: FightEvent[]) => {
  try {
    fs.writeFileSync(
      `./${FILENAME}`,
      JSON.stringify(
        events.map((event) => ({
          ...event,
          time: event.time.unix(),
        })),
      ),
    );
  } catch {
    /* empty */
  }
};
