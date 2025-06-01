// src/components/Section.jsx
import Card from "./Card";

export default function Section({
  title,
  items,
  cardSize
}) {
  return (
    <section className="mb-10">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>

        {cardSize ? (
          // FLEX WRAP LAYOUT for small cards (Marketplace, Search)
          <div className="flex flex-wrap gap-4 justify-start">
            {items.map(item => {
              if (!item?.name || !item?.image || !item?.price) return null;
              return (
                <div key={item._id || item.id} className={`flex-none ${cardSize}`}>
                  <Card {...item} />
                </div>
              );
            })}
          </div>
        ) : (
          // DEFAULT GRID LAYOUT for Home
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
            {items.map(item => (
              <Card key={item._id || item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
