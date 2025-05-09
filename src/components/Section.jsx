import Card from "./Card";

export default function Section({ title, items }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
        {items.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
