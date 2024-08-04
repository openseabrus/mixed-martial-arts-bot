import TelegramBot from "node-telegram-bot-api";
import { FightEventWithDiff } from "../types";
import { prettifyEvents } from "../utils";

export const sendMessage = (
  bot: TelegramBot,
  chatId: string,
  message: string,
) => {
  if (message) {
    bot.sendMessage(chatId, message, { parse_mode: "HTML" });
  }
};

type EventChanges = {
  eventsChanged: FightEventWithDiff[];
  eventsReceived: FightEventWithDiff[];
  eventsRemoved: FightEventWithDiff[];
};

export const processEventChanges = (
  bot: TelegramBot,
  chatId: string,
  events: EventChanges,
) => {
  sendMessage(bot, chatId, prettifyEvents(events.eventsChanged));
  sendMessage(bot, chatId, prettifyEvents(events.eventsRemoved, "remove"));
  sendMessage(bot, chatId, prettifyEvents(events.eventsReceived, "new"));
};
