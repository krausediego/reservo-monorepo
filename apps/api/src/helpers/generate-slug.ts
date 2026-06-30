/* eslint-disable no-await-in-loop */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function generateUniqueSlug(
  name: string,
  slugExists: (slug: string) => Promise<number>,
): Promise<string> {
  const baseSlug = slugify(name);

  let slug = baseSlug;
  let counter = 2;

  while (await slugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}
