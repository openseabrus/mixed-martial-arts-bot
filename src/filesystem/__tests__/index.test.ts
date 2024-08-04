import dayjs from "dayjs";
import fs from "node:fs";
import { readFights, writeFights } from "..";
import { FightEvent } from "../../types";

jest.mock("node:fs");

describe("readFights", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should read and parse fights from the file correctly", () => {
    const mockData = JSON.stringify([
      { id: 1, description: "Fight 1", time: 1625014800 },
      { id: 2, description: "Fight 2", time: 1625101200 },
    ]);

    jest.spyOn(fs, "readFileSync").mockReturnValue(mockData);

    const expectedFights = [
      { id: 1, description: "Fight 1", time: dayjs.unix(1625014800) },
      { id: 2, description: "Fight 2", time: dayjs.unix(1625101200) },
    ];

    const fights = readFights();
    expect(fights).toEqual(expectedFights);
  });

  it("should return an empty array if file read fails", () => {
    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("File not found");
    });

    const fights = readFights();
    expect(fights).toEqual([]);
  });
});

describe("writeFights", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should write fights to the file correctly", () => {
    const mockDate1 = dayjs.unix(1625014800);
    const mockDate2 = dayjs.unix(1625101200);
    const events: FightEvent[] = [
      { id: "1", eventName: "Fight 1", time: mockDate1, url: "1" },
      { id: "2", eventName: "Fight 2", time: mockDate2, url: "2" },
    ];

    jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});

    writeFights(events);

    const expectedData = JSON.stringify([
      { id: "1", eventName: "Fight 1", time: 1625014800, url: "1" },
      { id: "2", eventName: "Fight 2", time: 1625101200, url: "2" },
    ]);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `./fights.json`,
      expectedData,
    );
  });

  it("should handle errors during file write", () => {
    jest.spyOn(fs, "writeFileSync").mockImplementation(() => {
      throw new Error("Write error");
    });

    const mockDate1 = dayjs.unix(1625014800);
    const mockDate2 = dayjs.unix(1625101200);
    const events: FightEvent[] = [
      { id: "1", eventName: "Fight 1", time: mockDate1, url: "1" },
      { id: "2", eventName: "Fight 2", time: mockDate2, url: "2" },
    ];

    expect(() => writeFights(events)).not.toThrow();
  });
});
