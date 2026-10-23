/** Simple client-side matching over name, category and tags. */

export interface Searchable {
  name: string;
  categoryName?: string;
  tags: string[];
}

const SYNONYMS: Record<string, string[]> = {
  fish: ["hake", "snoek", "basa", "seafood"],
  sausage: ["wors"],
  boerewors: ["wors"],
  braai: ["wors", "chops", "steak"],
  lamb: ["mutton"],
  mutton: ["lamb"],
  hampers: ["hamper"],
  bulk: ["hamper"],
};

function normalise(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ");
}

export function matchesQuery(item: Searchable, query: string) {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalise([item.name, item.categoryName ?? "", ...item.tags].join(" "));
  return terms.every((term) => {
    const options = [term, ...(SYNONYMS[term] ?? [])];
    // Also match simple plurals such as "chops" → "chop".
    if (term.length > 3 && term.endsWith("s")) options.push(term.slice(0, -1));
    return options.some((t) => haystack.includes(t));
  });
}
