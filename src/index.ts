import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { configDotenv } from "dotenv";
import schedule, { Job } from "node-schedule";
import TelegramBot from "node-telegram-bot-api";
import { readFights, writeFights } from "./filesystem";
import { getEventDetails } from "./scraper";
import { processEventChanges, sendMessage } from "./bot";
import { FightEvent } from "./types";
import { prettifyEvents } from "./utils";

configDotenv();
dayjs.extend(customParseFormat);

const { BOT_TOKEN, CRON = "3 * * * *", CHAT_ID = "" } = process.env;
let eventJobs: Job[] = [];

if (!BOT_TOKEN) {
  console.log("❌ No BOT_TOKEN was set in .env!");
  process.exit();
}
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const initializeEvents = async () => {
  savedEvents = readFights();
  const {
    eventsChanged,
    eventsReceived,
    eventsRemoved,
    fetchedEvents: fetched,
  } = await getEventDetails(savedEvents);

  processEventChanges(bot, CHAT_ID, {
    eventsChanged,
    eventsReceived,
    eventsRemoved,
  });
  writeFights(fetched);
  fetchedEvents = fetched;

  return fetchedEvents;
};

let savedEvents: FightEvent[];
let fetchedEvents: FightEvent[];

await initializeEvents();

schedule.scheduleJob("polls", CRON, async () => {
  fetchedEvents = await initializeEvents();

  console.log("jobs", eventJobs);
  eventJobs.filter((job) => !!job).forEach((job) => job.cancel());
  eventJobs = [];

  fetchedEvents.forEach((event) => {
    const job = schedule.scheduleJob(
      event.id ?? event.eventName,
      event.time.toDate(),
      () => sendMessage(bot, CHAT_ID, "🚨🚨🚨🚨\n" + prettifyEvents([event])),
    );
    eventJobs.push(job);
  });
});

bot.onText(/\/list/, () => {
  const now = dayjs();
  const eventInTimeFrame = fetchedEvents.findIndex(
    ({ time }) => time.diff(now, "days") > 30,
  );
  const eventsInTimeFrame = fetchedEvents.slice(0, eventInTimeFrame);

  sendMessage(bot, CHAT_ID, prettifyEvents(eventsInTimeFrame));
});

bot.onText(/\/jobs/, () => {
  sendMessage(bot, CHAT_ID, JSON.stringify(eventJobs, null, 4));
});

process.on("SIGINT", function () {
  schedule.gracefulShutdown().then(() => process.exit(0));
});
