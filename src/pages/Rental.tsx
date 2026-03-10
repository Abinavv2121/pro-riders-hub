import EventSupport from "@/components/EventSupport";
import PageShell from "@/components/PageShell";
import RentalBikes from "@/components/RentalBikes";

const Rental = () => {
  return (
    <PageShell>
      <RentalBikes />
      <div className="pb-16" />
      <EventSupport />
    </PageShell>
  );
};

export default Rental;

