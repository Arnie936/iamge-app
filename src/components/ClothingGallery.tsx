"use client";

const CLOTHING_ITEMS = [
  { src: "/clothing/denim-jacket.png", name: "Denim Jacket" },
  { src: "/clothing/red-hat.png", name: "Red Hat" },
  { src: "/clothing/sunglasses.png", name: "Sunglasses" },
  { src: "/clothing/propeller-cap.png", name: "Propeller Cap" },
];

interface ClothingGalleryProps {
  onSelect: (file: File) => void;
  selectedName: string | null;
}

export default function ClothingGallery({
  onSelect,
  selectedName,
}: ClothingGalleryProps) {
  const handleClick = async (item: (typeof CLOTHING_ITEMS)[number]) => {
    const res = await fetch(item.src);
    const blob = await res.blob();
    const file = new File([blob], item.name + ".png", { type: blob.type });
    onSelect(file);
  };

  return (
    <div>
      <h3 className="mb-4 text-xs font-medium tracking-wider text-black uppercase">
        Or select a clothing item
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CLOTHING_ITEMS.map((item) => (
          <button
            key={item.src}
            onClick={() => handleClick(item)}
            className={`group flex flex-col items-center rounded-lg border p-3 transition-colors hover:border-black ${
              selectedName === item.name
                ? "border-black bg-gray-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <img
              src={item.src}
              alt={item.name}
              className="h-28 w-full rounded object-contain"
            />
            <span className="mt-2 text-xs tracking-wider text-gray-600 group-hover:text-black">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
