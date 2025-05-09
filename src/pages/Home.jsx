import React from "react";
import Section from "../components/Section";
import { trendingData } from "../data";

export default function Home() {
  return (
    <>
      <Section title="Trending Today" items={trendingData} />
      {/* you can add more “home” widgets here */}
    </>
  );
}
