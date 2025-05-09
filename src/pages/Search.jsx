import React from "react";
import Searchbar from "../components/Searchbar";
import Section   from "../components/Section";
import { featuredData } from "../data";
import { useState } from "react";
import Card from "../components/Card";


export default function Search() {
  const [query, setQuery] = useState("");

  const filtered = featuredData.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
);
  return (
    <div className="p-4 text-white">
      <Searchbar value={query} onChange={setQuery}/>
      <h2 className="text-xl mb-2">Featured</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((card, i) => (
          <Card key={i} {...card}  /> 
        ))}
      </div>
    </div>
  );
}
