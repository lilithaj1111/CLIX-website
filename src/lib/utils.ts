/** cn — tiny class-name joiner. Filters falsey values + joins on space.
 *  Lightweight stand-in for `clsx` since the project doesn't need its
 *  variant-merging power (Tailwind utility de-dupe is rare here). */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}
