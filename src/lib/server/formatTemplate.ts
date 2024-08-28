/**
 * Helper function for formatting template strings
 *
 * @param input input string
 * @param replacements replacement strings to apply
 */
export default function formatTemplate(
  input: string,
  replacements: [string, string][],
): string {
  for (const [matcher, replacement] of replacements) {
    input = input.replaceAll(`{{${matcher}}}`, replacement);
  }
  return input.trimStart();
}
