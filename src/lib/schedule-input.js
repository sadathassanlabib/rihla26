const str = (v, max) => String(v ?? "").trim().slice(0, max);

export function cleanDay(b) {
  const day = Number(b.day);
  if (!Number.isInteger(day) || day < 1 || day > 10) return { error: "Day must be 1–10" };
  const title = str(b.title, 120);
  if (!title) return { error: "Day title is required" };

  const activities = (Array.isArray(b.activities) ? b.activities : [])
    .slice(0, 40)
    .map((a) => ({
      startTime: str(a.startTime, 5),
      endTime: str(a.endTime, 5),
      title: str(a.title, 120),
      description: str(a.description, 1000),
      location: str(a.location, 120),
      note: str(a.note, 300),
    }))
    .filter((a) => a.title);

  const date = b.date ? new Date(b.date) : undefined;
  return {
    data: {
      day, title, activities,
      summary: str(b.summary, 400),
      date: date && !isNaN(date) ? date : undefined,
    },
  };
}