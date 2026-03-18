import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

function getPrice(card) {
  const p = card.cardmarket?.prices?.averageSellPrice || card.cardmarket?.prices?.avg1;
  return p && p > 0 ? parseFloat(p.toFixed(2)) : 9.95;
}

const API_URL = "https://api.pokemontcg.io/v2/cards?q=set.id:base1&pageSize=20&select=id,name,images,rarity,set,cardmarket";
const MAX_RETRIES = 30;
const RETRY_DELAY = 2000;

async function fetchWithRetry(onAttempt, onSuccess, onFail) {
  for (let i = 1; i <= MAX_RETRIES; i++) {
    onAttempt(i);
    try {
      const r = await fetch(API_URL);
      if (!r.ok) throw new Error();
      const data = await r.json();
      onSuccess(data.data);
      return;
    } catch {
      if (i < MAX_RETRIES) {
        await new Promise(res => setTimeout(res, RETRY_DELAY));
      }
    }
  }
  onFail();
}

export default function Home() {
  const { addToCart, count } = useCart();
  const [cards, setCards]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [attempt, setAttempt] = useState(1);

  function load() {
    setLoading(true);
    setError(false);
    setAttempt(1);
    fetchWithRetry(
      (n) => setAttempt(n),
      (data) => { setCards(data.map(c => ({ ...c, price: getPrice(c) }))); setLoading(false); },
      () => { setError(true); setLoading(false); }
    );
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <nav>
        <a href="/">Pokémon Webshop</a>
        <Link href="/cart">Kurv ({count})</Link>
      </nav>

      <div className="container">
        <h1>Pokémon Kort</h1>

        {loading && (
          <p className="center">Henter kort... (forsøg nr. {attempt}/{MAX_RETRIES})</p>
        )}

        {error && (
          <div className="center">
            <p>Kunne ikke hente kort efter {MAX_RETRIES} forsøg.</p>
            <button className="btn mt" onClick={load}>Prøv igen</button>
          </div>
        )}

        <div className="grid">
          {cards.map(card => (
            <div key={card.id} className="card">
              <img src={card.images.small} alt={card.name} />
              <div className="info">
                <div className="name">{card.name}</div>
                <div className="price">{card.price.toFixed(2)} kr.</div>
              </div>
              <button onClick={() => addToCart(card)}>Læg i kurv</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
