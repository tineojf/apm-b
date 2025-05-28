export const generatePrayer = (answer: string) => {
  return `Write a 55-word Catholic prayer that reflects:
  - My current relationship with God: ${answer}
  - A time of social, economic, or spiritual hardship (as background context)
  The prayer must be hopeful and spiritual, but do not directly mention any country or specific event. End with a Bible verse.`;
};

export const generateCitation = `Return a random Bible verse in the following format:
  "phrase" - author:verse
  Do not repeat a previously used verse. Only return the citation, with no explanations.`;
