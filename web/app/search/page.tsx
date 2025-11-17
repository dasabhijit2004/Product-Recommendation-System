import Link from "next/link";
import ProductCard from "@/components/ProductCard";

type Product = {
  product_id: string;
  name: string;
  brand: string;
  categories: string;
  avg_rating: number;
  sentiment_score: number;
  image_url?: string;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:8000/products/all", {
    cache: "no-store",
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.products ?? [];
}

export default async function SearchPage(props: any) {
  const searchParams = await props.searchParams;

  // Query
  const query = (searchParams?.query || "").toLowerCase();

  // Filters
  const selectedBrand = searchParams?.brand || "";
  const selectedCategory = searchParams?.category || "";
  const sort = searchParams?.sort || "";

  // Fetch all products
  const allProducts = await getProducts();

  // Extract brands & categories
  const allBrands = [...new Set(allProducts.map((p) => p.brand))].sort();

  const allCategories = [
    ...new Set(
      allProducts.map((p) =>
        p.categories ? p.categories.split(",")[0].trim() : ""
      )
    ),
  ].sort();

  // Step 1: Search filter
  let filtered = allProducts.filter((p) =>
    (p.name + " " + p.brand + " " + p.categories)
      .toLowerCase()
      .includes(query)
  );

  // Step 2: Brand filter
  if (selectedBrand) {
    filtered = filtered.filter((p) => p.brand === selectedBrand);
  }

  // Step 3: Category filter
  if (selectedCategory) {
    filtered = filtered.filter((p) =>
      p.categories.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }

  // Step 4: Sorting
  if (sort === "rating_desc") {
    filtered = filtered.sort((a, b) => b.avg_rating - a.avg_rating);
  } else if (sort === "rating_asc") {
    filtered = filtered.sort((a, b) => a.avg_rating - b.avg_rating);
  } else if (sort === "sentiment_desc") {
    filtered = filtered.sort(
      (a, b) => b.sentiment_score - a.sentiment_score
    );
  } else if (sort === "sentiment_asc") {
    filtered = filtered.sort(
      (a, b) => a.sentiment_score - b.sentiment_score
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-10 flex gap-8">
      
      {/* Sidebar Filters */}
      <aside className="w-64 p-4 bg-slate-900 border border-slate-800 rounded-xl h-fit">
        <h2 className="font-semibold text-xl mb-4">Filters</h2>

        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="text-slate-300 font-medium mb-2">Brand</h3>
          {allBrands.map((b) => (
            <Link
              key={b}
              href={`/search?query=${query}&brand=${b}&category=${selectedCategory}&sort=${sort}`}
              className={`block text-sm mb-1 ${
                selectedBrand === b ? "text-sky-400 font-semibold" : "text-slate-400"
              }`}
            >
              {b}
            </Link>
          ))}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-slate-300 font-medium mb-2">Category</h3>
          {allCategories.map((c) => (
            <Link
              key={c}
              href={`/search?query=${query}&brand=${selectedBrand}&category=${c}&sort=${sort}`}
              className={`block text-sm mb-1 ${
                selectedCategory === c ? "text-sky-400 font-semibold" : "text-slate-400"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-slate-300 font-medium mb-2">Sort by</h3>

          <Link
            href={`/search?query=${query}&brand=${selectedBrand}&category=${selectedCategory}&sort=rating_desc`}
            className="block text-slate-400 text-sm mb-1 hover:text-sky-400"
          >
            ⭐ Rating (High → Low)
          </Link>

          <Link
            href={`/search?query=${query}&brand=${selectedBrand}&category=${selectedCategory}&sort=sentiment_desc`}
            className="block text-slate-400 text-sm mb-1 hover:text-sky-400"
          >
            ❤️ Sentiment Score (High → Low)
          </Link>
        </div>
      </aside>

      {/* Search Results */}
      <section className="flex-1">
        <h1 className="text-2xl font-bold mb-6">
          Search results for: "{query}"
        </h1>

        {filtered.length === 0 ? (
          <p className="text-slate-400">No matching products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
