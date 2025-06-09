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
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
          {items.map((item, index) => (
            <Card
              key={item.id || index}
              {...item}
              className={cardSize}
              showBuyLink={showBuyLink}
              showSetAndRarity={showSetAndRarity}
              inSearch={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
