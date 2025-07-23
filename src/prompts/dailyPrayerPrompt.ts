export const generatePrayer = (answer: string) => {
  return `Write a 55-word Catholic prayer that reflects:
  - My current relationship with God: ${answer}
  - A context of social, economic, or spiritual hardship
  The prayer should be hopeful, spiritual, and aligned with Catholic tradition (e.g., may include thanksgiving, petition, or intercession). Do not mention any country or specific event.
  Conclude with a Bible verse that reinforces the message of the prayer.`;
};
