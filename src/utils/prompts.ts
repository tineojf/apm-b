export const generatePrayer = (answer: string) => {
  return `Write a 55-word Catholic prayer that reflects:
  - My current relationship with God: ${answer}
  - A time of social, economic, or spiritual hardship (as background context)
  The prayer must be hopeful and spiritual, but do not directly mention any country or specific event. End with a Bible verse.`;
};

export const generateCitation = `Return a random Bible verse in the following format:
  "phrase" - author:verse
  The verse must be contextually related to the current day. If we are near a significant Christian observance (e.g. Easter, Christmas, Lent, Pentecost), choose a verse that reflects that theme, considering the general Christian calendar (Catholic, Protestant, or Orthodox).
  Do not repeat a previously used verse. Only return the citation, with no explanations.`;
