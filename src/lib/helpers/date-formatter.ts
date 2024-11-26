/**
 * A helper function to format date to Indonesian format
 * @type {*}
 */
export const dateFormatter = new Intl.DateTimeFormat("id", {
  weekday: "long",
  year: "numeric",
  day: "numeric",
  month: "long",
});
