const pills = ["Shirts", "T-Shirts", "Jackets", "Trousers", "Dresses"];

export default function PageTitle() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-4">
      <h1 className="text-3xl font-bold text-black mb-4">Virtual Try-On</h1>
      <div className="flex flex-wrap gap-2">
        {pills.map((pill) => (
          <button
            key={pill}
            className="rounded-full border border-gray-300 px-4 py-1.5 text-xs tracking-wider text-black uppercase hover:border-black transition-colors"
          >
            {pill}
          </button>
        ))}
      </div>
    </div>
  );
}
