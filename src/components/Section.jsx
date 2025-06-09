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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map((item, index) => (
            <div key={item.id || index} className="flex justify-center">
              <Card
                {...item}
                className={cardSize || "w-full"}
                showBuyLink={showBuyLink}
                showSetAndRarity={showSetAndRarity}
                inSearch={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
