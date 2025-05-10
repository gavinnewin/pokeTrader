import Section from "../components/Section";
import { featuredCards, watchlistCards } from "../data";
import Searchbar from "../components/Searchbar";

export default function Marketplace() {
  return (
    <div className="max-w-7xl mx-auto p-4 text-white">
      <Section title="Featured" items={featuredCards} />
      <Section title="From Your Watchlist" items={watchlistCards} />
    </div>
  );
}