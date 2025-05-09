import Section from "../components/Section";
import { featuredCards, watchlistCards } from "../data";

export default function Marketplace() {
  return (
    <div className="p-6 text-white">
      <Section title="Featured" items={featuredCards} />
      <Section title="From Your Watchlist" items={watchlistCards} />
    </div>
  );
}
