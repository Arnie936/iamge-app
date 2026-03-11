"use client";

interface ResultDisplayProps {
  resultUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function ResultDisplay({
  resultUrl,
  isLoading,
  error,
}: ResultDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
        <p className="text-sm text-gray-600">
          Generating... This may take up to 90 seconds.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (resultUrl) {
    return (
      <div className="flex flex-col items-center gap-4">
        <img
          src={resultUrl}
          alt="Virtual try-on result"
          className="max-h-[500px] w-full rounded-lg object-contain border border-gray-200"
        />
        <a
          href={resultUrl}
          download="try-on-result.png"
          className="bg-black px-8 py-3 text-xs tracking-wider text-white uppercase hover:bg-gray-800 transition-colors"
        >
          Download Result
        </a>
      </div>
    );
  }

  return null;
}
