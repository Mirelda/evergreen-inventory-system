export function splitAndUpperCaseCamelCase(text) {
  return (
    text
      // Insert a space before all uppercase letters, except the first one
      .replace(/([A-Z])/g, " $1")
      // Trim any leading space
      .trim()
      // Convert the entire string to uppercase
      .toUpperCase()
  );
}
