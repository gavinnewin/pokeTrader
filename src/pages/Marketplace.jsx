import Section from "../components/Section";
 import { featuredCards, watchlistCards } from "../data";
 import Searchbar from "../components/Searchbar";

 export default function Marketplace() {
   return (
     <div className="marketplace p-4 text-white">

      <Searchbar className="w-64 mb-6" />
      <Section title="Featured" items={featuredCards} cardSize="w-40" />
      <Section
        title="From Your Watchlist"
        items={watchlistCards}
       cardSize="w-40"
      />
     </div>
   );
 }
