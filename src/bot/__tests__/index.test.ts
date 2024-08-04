import TelegramBot from "node-telegram-bot-api";
import { sendMessage } from "../index";

describe("sendMessage", () => {
  let bot: TelegramBot;

  beforeEach(() => {
    bot = {
      sendMessage: jest.fn(),
    } as unknown as TelegramBot;
  });

  test("should send a message if the message is provided", () => {
    const chatId = "12345";
    const message = "Hello, World!";

    sendMessage(bot, chatId, message);

    expect(bot.sendMessage).toHaveBeenCalledTimes(1);
    expect(bot.sendMessage).toHaveBeenCalledWith(chatId, message, {
      parse_mode: "HTML",
    });
  });

  test("should not send a message if the message is empty", () => {
    const chatId = "12345";
    const message = "";

    sendMessage(bot, chatId, message);

    expect(bot.sendMessage).not.toHaveBeenCalled();
  });

  test("should not send a message if the message is null", () => {
    const chatId = "12345";
    const message = null;

    sendMessage(bot, chatId, message!);

    expect(bot.sendMessage).not.toHaveBeenCalled();
  });

  test("should not send a message if the message is undefined", () => {
    const chatId = "12345";
    const message = undefined;

    sendMessage(bot, chatId, message!);

    expect(bot.sendMessage).not.toHaveBeenCalled();
  });
});
