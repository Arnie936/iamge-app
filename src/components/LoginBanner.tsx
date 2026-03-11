import Link from "next/link";

export default function LoginBanner() {
  return (
    <div className="w-full bg-black py-2.5 text-center">
      <Link href="/login" className="text-xs tracking-wider text-white uppercase">
        Login & check your shopping bag for special offers.
      </Link>
    </div>
  );
}
