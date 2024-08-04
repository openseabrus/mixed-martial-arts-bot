import { Dayjs } from "dayjs";

export interface FightEvent {
  time: Dayjs;
  eventName: string;
  id?: string;
  url: string;
}

export interface FightEventWithDiff extends FightEvent {
  oldTime?: Dayjs;
  oldEventName?: string;
}
