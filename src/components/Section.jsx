import Card from "./Card";

export default function Section({
  title,
  items,
  cardSize,
  showBuyLink = true,
  showSetAndRarity = false
}) {
  return (
    <section className="mb-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-4">
          {items.map(item => (
            <Card
              key={item._id || item.id}
              {...item}
              className={cardSize}
              showBuyLink={showBuyLink}
              showSetAndRarity={showSetAndRarity}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
