import React from "react";
import Card from "./Card";

export default function Section({ title, items }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
