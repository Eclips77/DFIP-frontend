const DEFAULT_LOCALE = "en-US";
const DEFAULT_TIME_ZONE = "UTC";

const toDate = (input: string | number | Date): Date =>
  input instanceof Date ? input : new Date(input);

const monthDayFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  month: "short",
  day: "numeric",
  timeZone: DEFAULT_TIME_ZONE,
});

const dateTimeFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: DEFAULT_TIME_ZONE,
});

export const formatMonthDay = (input: string | number | Date): string =>
  monthDayFormatter.format(toDate(input));

export const formatDateTime = (input: string | number | Date): string =>
  dateTimeFormatter.format(toDate(input));
