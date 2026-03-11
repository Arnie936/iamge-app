"use client";

import { useState } from "react";
import ImageUploadZone from "./ImageUploadZone";
import ResultDisplay from "./ResultDisplay";
import { generateTryOn } from "@/lib/api";

export default function TryOnSection() {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = personImage !== null && clothingImage !== null;

  const handleGenerate = async () => {
    if (!personImage || !clothingImage) return;

    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    try {
      const url = await generateTryOn(personImage, clothingImage);
      setResultImageUrl(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ImageUploadZone
          label="Upload Person Image"
          file={personImage}
          onFileChange={setPersonImage}
        />
        <ImageUploadZone
          label="Upload Clothing Image"
          file={clothingImage}
          onFileChange={setClothingImage}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isLoading}
          className="bg-black px-10 py-3 text-xs tracking-wider text-white uppercase hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Generating..." : "Generate Try-On"}
        </button>
      </div>

      <div className="mt-10">
        <ResultDisplay
          resultUrl={resultImageUrl}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </section>
  );
}
