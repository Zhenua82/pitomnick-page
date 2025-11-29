// /pages/index.tsx
import React from 'react';
import Layout from '../components/Layout';
import PlantCard from '../components/PlantCard';
import { plants } from '../data/plants';
import styles from '../styles/Home.module.css';
import Head from 'next/head';

const HomePage: React.FC = () => {
  const items = Object.values(plants);
  return (
    <Layout>
      <Head>
        <title>Питомник хвойных растений в Анапе — купить саженцы и растения</title>
        <meta
          name="description" content="Большой выбор хвойных саженцев и растений в питомнике Анапы. Заказать саженцы онлайн с доставкой по региону. Гарантия качества и лучшие цены!"
        />
      </Head>
      <section className={styles.hero}>
        <h1>Питомник хвойных растений</h1>
        <p>Короткое приветствие — лучшие саженцы ели, сосны и можжевельника.</p>
      </section>

      <section>
        <h2>Наши растения (5-летние)</h2>
        <div className={styles.grid}>
          {items.map((p) => (
            <PlantCard
              key={p.slug}
              slug={p.slug}
              title={p.title}
              image={p.photo['5 летннее растение']}
              opisanie={p.opisanie}
            />
          ))}
        </div>
      </section>

      <section className={styles.info}>
        <h2>Почему мы</h2>
        <ul>
          <li>Качественные саженцы</li>
          <li>Доставка и консультации по посадке</li>
          <li>Гарантии приживаемости на первое время</li>
        </ul>
      </section>
    </Layout>
  );
};

export default HomePage;