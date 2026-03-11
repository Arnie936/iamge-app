import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import LoginBanner from "@/components/LoginBanner";
import Breadcrumb from "@/components/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import FilterBar from "@/components/FilterBar";
import TryOnSection from "@/components/TryOnSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <TopBanner />
      <Header />
      <NavBar />
      <LoginBanner />
      <Breadcrumb />
      <PageTitle />
      <FilterBar />
      <TryOnSection />
    </div>
  );
}
