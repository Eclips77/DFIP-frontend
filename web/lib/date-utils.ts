const DEFAULT_LOCALE = "en-US";
const DEFAULT_TIME_ZONE = "UTC";

const toDate = (input: string | number | Date): Date => {
  if (input instanceof Date) return input;
  const date = new Date(input);
  return isNaN(date.getTime()) ? new Date() : date;
};

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
