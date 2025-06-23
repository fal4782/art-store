// components/OrderCard.tsx
import { type Order } from "../utils/types";
export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="border p-4 rounded shadow">
      <h4 className="font-bold">Order #{order.id}</h4>
      <p>Status: {order.status}</p>
      <ul className="ml-4 list-disc">
        {order.orderItems.map((item) => (
          <li key={item.artworkId}>
            {item.artwork.title} × {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
