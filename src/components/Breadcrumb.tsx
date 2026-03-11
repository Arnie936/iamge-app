const items = ["Men", "Accessories", "Virtual Try-On"];

export default function Breadcrumb() {
  return (
    <nav className="mx-auto max-w-[1440px] px-6 pt-6 pb-2">
      <ol className="flex items-center gap-1.5 text-xs">
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-gray-400">&gt;</span>}
            <span
              className={
                i === items.length - 1
                  ? "text-black font-medium"
                  : "text-gray-500 cursor-pointer hover:text-black"
              }
            >
              {item}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
