// src/pages/HeroesPage/HeroesPage.jsx
import React, { useEffect, useState } from "react";

function HeroesPage() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroes() {
      try {
        const response = await fetch("http://localhost:4000/heroes"); // сюда твой бекенд
        const data = await response.json();
        setHeroes(data);
      } catch (error) {
        console.error("Ошибка загрузки героев:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHeroes();
  }, []);

  if (loading) {
    return <div>Загрузка героев...</div>;
  }

  return (
    <div>
      <h1>Список Героев</h1>
      <ul>
        {heroes.map((hero) => (
          <li key={hero.id}>
            {hero.display_name}
            {/* <img
              src={`https://cdn.stratz.com/images/dota2/heroes/${hero.short_name}_vert.png`}
              alt={hero.displayName}
            />{" "} */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HeroesPage;
