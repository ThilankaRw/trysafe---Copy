import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Footer from "./Footer";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <MainContent />
        <Footer />
      </div>
    </div>
  );
}
