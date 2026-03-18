import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, count } = useCart();

  return (
    <>
      <nav>
        <a href="/">Pokémon Webshop</a>
        <Link href="/cart">Kurv ({count})</Link>
      </nav>

      <div className="container">
        <h1>Indkøbskurv</h1>

        {cart.length === 0 ? (
          <div className="center">
            <p>Kurven er tom.</p>
            <Link href="/" className="btn mt">Gå til butikken</Link>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Kort</th>
                  <th>Navn</th>
                  <th>Pris</th>
                  <th>Antal</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id}>
                    <td><img src={item.images.small} alt={item.name} /></td>
                    <td>{item.name}</td>
                    <td>{item.price.toFixed(2)} kr.</td>
                    <td>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      {" "}{item.qty}{" "}
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </td>
                    <td>{(item.price * item.qty).toFixed(2)} kr.</td>
                    <td><button className="qty-btn" onClick={() => removeFromCart(item.id)}>Fjern</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-right mt"><strong>Total: {total.toFixed(2)} kr.</strong></p>

            <div className="mt">
              <Link href="/" className="btn btn-outline">Tilbage til shoppen</Link>
              <Link href="/checkout" className="btn">Gå til betaling</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
