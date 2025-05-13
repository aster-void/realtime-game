export function randomString(
  length: number,
  options: {
    lower?: boolean;
    upper?: boolean;
    numbers?: boolean;
  } = {
    lower: true,
    upper: true,
    numbers: true,
  },
) {
  let characters = "";
  if (options.lower) characters += "abcdefghijklmnopqrstuvwxyz";
  if (options.upper) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.numbers) characters += "0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}
