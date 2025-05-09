import React from 'react';
import Card from './Card';        // ← import it here

export default function Section({ title, items }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {items.map(item => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
