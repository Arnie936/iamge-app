const categories = [
  "Women",
  "Men",
  "Kids",
  "Home & Design",
  "Beauty",
  "Food & Drinks",
];

export default function NavBar() {
  return (
    <nav className="w-full border-b border-gray-200">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6 overflow-x-auto">
          {categories.map((cat) => (
            <span
              key={cat}
              className="cursor-pointer whitespace-nowrap text-xs tracking-wider text-black uppercase hover:opacity-70"
            >
              {cat}
            </span>
          ))}
          <span className="cursor-pointer whitespace-nowrap text-xs tracking-wider font-semibold text-red-600 uppercase">
            Promo
          </span>
          <span className="cursor-pointer whitespace-nowrap text-xs tracking-wider text-black uppercase hover:opacity-70">
            Gifting
          </span>
          <span className="cursor-pointer whitespace-nowrap text-xs tracking-wider text-black uppercase hover:opacity-70">
            Brands
          </span>
          <span className="cursor-pointer whitespace-nowrap text-xs tracking-wider text-black uppercase hover:opacity-70">
            Stores & Restaurants
          </span>
          <span className="cursor-pointer whitespace-nowrap text-xs tracking-wider text-black uppercase hover:opacity-70">
            Events
          </span>
        </div>
        <button className="ml-4 shrink-0 rounded-full bg-black px-4 py-1.5 text-xs tracking-wider text-white uppercase hover:bg-gray-800">
          Need some help?
        </button>
      </div>
    </nav>
  );
}
