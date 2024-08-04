import dayjs, { Dayjs } from "dayjs";
import { FightEvent, FightEventWithDiff } from "../types";

const getFormattedDate = (time: Dayjs) => time.format("D MMM | HH:mm");

const prettifyValueDiff = (
  value: Dayjs | string,
  oldValue?: Dayjs | string,
): string => {
  const extractValue = (value: Dayjs | string) =>
    typeof value === "string" ? value : getFormattedDate(value);

  const oldPart = `${oldValue ? extractValue(oldValue) : ""}`;
  const newPart = `<strong>${extractValue(value)}</strong>`;

  return `${oldPart ? "<del>" + oldPart + "</del>  ➡️  " : ""}${newPart}`;
};

export const prettifyEvents = (
  events: FightEventWithDiff[],
  mode?: "new" | "remove",
) => {
  let listToken = "🔹";
  if (mode === "new") {
    listToken = "❇️";
  } else if (mode === "remove") {
    listToken = "❌";
  }

  return events
    .map(({ eventName, time, oldEventName, oldTime }) => {
      return `🗓 ${prettifyValueDiff(
        time,
        oldTime,
      )} \n${listToken} ${prettifyValueDiff(eventName, oldEventName)}`;
    })
    .join("\n\n");
};

export const getEventChanges = (
  savedEvents: FightEvent[],
  fetchedEvents: FightEvent[],
) => {
  const eventsRemoved: FightEventWithDiff[] = [];
  const eventsChanged: FightEventWithDiff[] = [];
  const eventsReceived: FightEventWithDiff[] = [];

  fetchedEvents.forEach((fightEvent) => {
    const existingFight = savedEvents.find(({ id }) => id === fightEvent.id);

    if (!existingFight) {
      if (!fightEvent.time.isBefore(dayjs(), "days")) {
        eventsReceived.push(fightEvent);
      }
    } else {
      const existingTime = existingFight.time;
      const eventTime = fightEvent.time;
      if (
        !(
          existingFight.eventName == fightEvent.eventName &&
          existingTime.isSame(eventTime)
        )
      ) {
        const oldTime = !existingTime.isSame(eventTime)
          ? existingTime
          : undefined;
        const oldEventName =
          fightEvent.eventName !== existingFight.eventName
            ? existingFight.eventName
            : undefined;

        eventsChanged.push({ ...fightEvent, oldTime, oldEventName });
      }
    }
  });

  savedEvents.forEach((fightEvent) => {
    if (!fetchedEvents.some(({ id }) => id === fightEvent.id)) {
      if (fightEvent.time.isAfter(dayjs(), "days")) {
        eventsRemoved.push(fightEvent);
      }
    }
  });

  return { eventsRemoved, eventsChanged, eventsReceived };
};
