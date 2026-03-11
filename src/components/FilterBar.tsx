export default function FilterBar() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-black px-5 py-2 text-xs tracking-wider text-white uppercase">
            Filter by
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="21" y2="21" />
              <line x1="4" x2="20" y1="14" y2="14" />
              <line x1="4" x2="20" y1="7" y2="7" />
            </svg>
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="uppercase tracking-wider">Our Favorite</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
        <span className="text-xs text-gray-500">1 experience</span>
      </div>
    </div>
  );
}
