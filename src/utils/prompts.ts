export const generatePrayer = (answer: string) => {
  return `Write a 55-word Catholic prayer that reflects:
  - My current relationship with God: ${answer}
  - A context of social, economic, or spiritual hardship
  The prayer should be hopeful, spiritual, and aligned with Catholic tradition (e.g., may include thanksgiving, petition, or intercession). Do not mention any country or specific event.
  Conclude with a Bible verse that reinforces the message of the prayer.`;
};

export const generateCitation = `Return a random Bible verse in the following format:
  "phrase" - author:verse
  Rules:
  - Choose a verse relevant to today's date in the Christian calendar (Catholic, Protestant, or Orthodox).
  - If near a significant observance (Easter, Christmas, Lent, Pentecost), select a verse reflecting that theme.
  - Ensure the verse is not repeated recently.
  - You must vary the output randomly to avoid repetition, even if asked the same prompt multiple times.
  Return only the verse as specified, without explanations.`;
