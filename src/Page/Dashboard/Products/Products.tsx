import { MultiSelect } from "@/components/ui/multi-select";
import { useState } from "react";

export function ProductPage() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <MultiSelect
      onChange={setSelected}
      selected={selected}
      options={[
        {
          value: "next.js",
          label: "Next.js",
        },
        {
          value: "sveltekit",
          label: "SvelteKit",
        },
        {
          value: "nuxt.js",
          label: "Nuxt.js",
        },
        {
          value: "remix",
          label: "Remix",
        },
        {
          value: "astro",
          label: "Astro",
        },
        {
          value: "wordpress",
          label: "WordPress",
        },
        {
          value: "express.js",
          label: "Express.js",
        },
      ]}
    />
  );
}
