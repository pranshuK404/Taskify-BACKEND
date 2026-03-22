const STOP_WORDS = ["a", "an", "the", "of", "to", "for", "in", "on"];

export const generateProjectKey = (title) => {
  const cleaned = title
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase()
    .trim();

  const words = cleaned
    .split(" ")
    .filter(word => word && !STOP_WORDS.includes(word));

  let baseKey = "";

  if (words.length === 0) {
    baseKey = "PRJ";
  } else if (words.length === 1) {
    baseKey = words[0].slice(0, 3);
  } else {
    baseKey = words.map(word => word[0]).join("").slice(0, 3);
  }

  const randomNumber = Math.floor(100 + Math.random() * 900);

  return `${baseKey.toUpperCase()}-${randomNumber}`;
};
