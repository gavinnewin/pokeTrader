import React from "react";
import Searchbar from "../components/Searchbar";
import Section   from "../components/Section";
import { featuredData } from "../data";

export default function Search() {
  return (
    <>
      <Searchbar />
      <Section title="Featured" items={featuredData} />
    </>
  );
}
