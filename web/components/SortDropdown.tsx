"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const params = useSearchParams();

  function handleSort(e:any) {
    const sort = e.target.value;

    if (params.get("query")) {
      router.push(`/search?query=${params.get("query")}&sort=${sort}`);
    } else {
      router.push(`/?sort=${sort}`);
    }
  }

  return (
    <select
      onChange={handleSort}
      className="bg-slate-800 px-3 py-2 rounded border border-slate-700 text-white"
    >
      <option value="none">Sort By</option>
      <option value="price_low_high">Price: Low → High</option>
      <option value="price_high_low">Price: High → Low</option>
      <option value="most_reviewed">Most Reviewed</option>
    </select>
  );
}
