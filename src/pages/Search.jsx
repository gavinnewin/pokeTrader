// src/pages/Search.jsx
import React, { useState } from "react";
import Searchbar from "../components/Searchbar";
import Section   from "../components/Section";
import { featuredData } from "../data";

export default function Search() {
  const [query, setQuery] = useState("");
  const filtered = featuredData.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-page p-4 text-white">
      {/* fixed-width, centered search bar */}
      <Searchbar
        value={query}
        onChange={setQuery}
        className="w-64 mx-auto mb-6"
      />

      {/* reuse Section with small cards */}
      <Section
        title="Featured"
        items={filtered}
        cardSize="w-40"
      />
    </div>
  );
}
