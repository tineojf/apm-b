export const generatePrayer = (answer: string) => {
  return `Write a 55-word Catholic prayer that reflects:
  - My current relationship with God: ${answer}
  - A context of social, economic, or spiritual hardship
  The prayer should be hopeful, spiritual, and aligned with Catholic tradition (e.g., may include thanksgiving, petition, or intercession). Do not mention any country or specific event.
  Conclude with a Bible verse that reinforces the message of the prayer.`;
};


export const generateCitation = `Return a random Bible verse in the following format:
  "phrase" - author:verse
  The verse must be contextually related to the current day. If we are near a significant Christian observance (e.g. Easter, Christmas, Lent, Pentecost), choose a verse that reflects that theme, considering the general Christian calendar (Catholic, Protestant, or Orthodox).
  Do not repeat a previously used verse. Only return the citation, with no explanations.`;
