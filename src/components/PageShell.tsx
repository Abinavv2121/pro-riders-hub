import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

interface PageShellProps {
  children: React.ReactNode;
}

const PageShell = ({ children }: PageShellProps) => (
  <div className="min-h-screen">
    <Header />
    <main className="pt-24">{children}</main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default PageShell;
