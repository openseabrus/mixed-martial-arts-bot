import axios from "axios";
import { load } from "cheerio";
import dayjs from "dayjs";
import { FightEvent } from "../types";
import { getEventChanges } from "../utils";

const INPUT_FORMAT = "YYYY-MM-DD HH:mm A";

export const getAllEvents = async () => {
  try {
    const { data } = await axios.get("https://v3.streameast.to/mma/streams");

    const cheerio = load(data);
    const events: FightEvent[] = cheerio(".f1-podium--item")
      .map((_, element) => {
        const event = load(element);
        const time = dayjs(
          event(".f1-podium--time").text().trim(),
          INPUT_FORMAT,
        );
        const eventName = event(".f1-podium--driver").text().trim();
        const url = event(".f1-podium--link").attr("href")?.trim() ?? "";

        const match = url.match(/(\d+)$/);
        const id = match?.[1];

        return { time, eventName, url, id };
      })
      .toArray();

    return events;
  } catch (_) {
    return null;
  }
};

export const getEventDetails = async (savedEvents: FightEvent[]) => {
  const fetchedEvents = await getAllEvents();

  if (!fetchedEvents) {
    return null;
  }

  const now = dayjs();
  const fetchedEventsBuffer = fetchedEvents.filter((event) =>
    event.time.add(12, "hours").isAfter(now),
  );

  return {
    ...getEventChanges(savedEvents, fetchedEventsBuffer),
    fetchedEvents: fetchedEventsBuffer,
  };
};
