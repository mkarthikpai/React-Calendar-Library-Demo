export type Platform = "instagram" | "facebook" | "linkedin";

export interface Post {
  campaign_id: string;
  post_id: string;
  scheduled_date: string;
  caption: string;
  image_url: string;
  status: string;
  platform: Platform;
}

export type MonthObject = Record<string, Array<Record<string, Post[]>>>;

export const normalizeCalendarData = (
  data: MonthObject[]
): Record<string, Post[]> => {
  const map: Record<string, Post[]> = {};

  data.forEach((monthObj) => {
    const monthEntries = Object.values(monthObj)[0];

    monthEntries.forEach((entry) => {
      const dateKey = Object.keys(entry)[0];
      map[dateKey] = entry[dateKey];
    });
  });

  return map;
};
