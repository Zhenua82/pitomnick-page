// /pages/plants/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { plants, Plant } from '../../data/plants';
import styles from '../../styles/Plant.module.css';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, restoreCart } from '../../store/cartSlice';
import { RootState } from '@/store';
//Зажатие кнопок добавления и убавления товара:
import { useHoldButton } from "@/hooks/useHoldButton";
import Head from 'next/head';


type Props = {
  plant: Plant | null;
};

const PlantPage: React.FC<Props> = ({ plant }) => {
    const dispatch = useDispatch();
    // const [qty, setQty] = React.useState(0);
    const [qty, setQty] = React.useState<Record<string, number>>({});

//Забираем колличество товара из локалсторадж:
const cartItems = useSelector((state: RootState) => state.cart.items);
useEffect(() => {
  const initialQty: Record<string, number> = {};
  ages.forEach(age => {
    const item = cartItems.find(
      i => i.slug === plant!.slug && i.age === age
    );

    initialQty[age] = item ? item.quantity : 0;
  });

  setQty(initialQty);
}, [cartItems, plant!.slug]);
//Изменение внешнего вида кнопки при добавлении товара:
const [added, setAdded] = React.useState<Record<string, boolean>>({});
//Зажатие кнопок добавления и убавления товара:
const { start: startHold, stop: stopHold } = useHoldButton();

  if (!plant) {
    return (
      <Layout>
        <h2>Растение не найдено</h2>
        <p><Link href="/">Вернуться на главную</Link></p>
      </Layout>
    );
  }

  const ages = Object.keys(plant.photo) as Array<keyof typeof plant.photo>;

  return (
    <Layout>
      <Head>
        <title>{plant.title} — купить саженцы в питомнике Анапы</title>
        <meta
          name="description" content={`Покупайте саженцы "${plant.title}" в питомнике Анапы. Высокое качество, гарантированная доставка. Заказывайте прямо сейчас!`}
        />
      </Head>
      <div className={styles.header}>
        <h1>{plant.title}</h1>
        <p className={styles.short}>{plant.opisanie}</p>
      </div>

      <div className={styles.content}>
        <section className={styles.gallery}>
          {/* {ages.map((age) => (
            <figure key={age} className={styles.figure}>
              <img src={plant.photo[age]} alt={`${plant.title} — ${age}`} />
              <figcaption>
                <strong>{age}</strong>
                <div className={styles.price}>{plant.cena[age]}</div>
              </figcaption>
            </figure>
          ))} */}

          {ages.map(age => (
            <figure key={age} className={styles.figure}>
                <img src={plant.photo[age]} alt={`${plant.title} — ${age}`} />

                <figcaption>
                <strong>{age}</strong>
                <div className={styles.price}>{plant.cena[age]}</div>
                </figcaption>

                {/* управление количеством */}
                {/* <button onClick={() => 
                setQty(prev => ({ ...prev, [age]: Math.max(0, (prev[age] || 0) - 1) }))
                }>−</button>

                <span>{qty[age] || 0}</span>

                <button onClick={() =>
                setQty(prev => ({ ...prev, [age]: Math.min(1000, (prev[age] || 0) + 1) }))
                }>+</button> */}

                {/* уменьшение */}
            <button
              onMouseDown={() =>
                startHold(() =>
                  setQty(prev => ({
                    ...prev,
                    [age]: Math.max(0, (prev[age] || 0) - 1)
                  }))
                )
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() =>
                startHold(() =>
                  setQty(prev => ({
                    ...prev,
                    [age]: Math.max(0, (prev[age] || 0) - 1)
                  }))
                )
              }
              onTouchEnd={stopHold}
            >
              −
            </button>
            {/* вывод количества */}
            <span>{qty[age] || 0}</span>
            {/* увеличение */}
            <button
              onMouseDown={() =>
                startHold(() =>
                  setQty(prev => ({
                    ...prev,
                    [age]: Math.min(1000, (prev[age] || 0) + 1)
                  }))
                )
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() =>
                startHold(() =>
                  setQty(prev => ({
                    ...prev,
                    [age]: Math.min(1000, (prev[age] || 0) + 1)
                  }))
                )
              }
              onTouchEnd={stopHold}
            >
              +
            </button>

            <button
              className={`${styles.addBtn} ${added[age] ? styles.added : ''}`}
              onClick={() => {
                dispatch(
                  addItem({
                    slug: plant.slug,
                    age: age,
                    title: plant.title,
                    photo: plant.photo[age],
                    quantity: qty[age] || 0,
                    price: parseInt(plant.cena[age]),
                  })
                );
                // визуальный эффект “Добавлено!”
                setAdded((prev) => ({ ...prev, [age]: true }));
                setTimeout(() => {
                  setAdded((prev) => ({ ...prev, [age]: false }));
                }, 1500);
              }}
            >
              {added[age] ? "Добавлено!" : "Добавить в корзину"}
            </button>
            </figure>
            ))}
        </section>

        <section className={styles.details}>
          <h2>Подробное описание</h2>
          <p>{plant.podrobnoeOpisanie}</p>

          <h3>Цены</h3>
          <ul>
            {ages.map((age) => (
              <li key={age}>
                <strong>{age}:</strong> {plant.cena[age]}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <button className="btn">Заказать</button>
            <Link href="/" className="btn btn-ghost">Вернуться</Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PlantPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = Object.keys(plants);
  const paths = slugs.map((s) => ({ params: { slug: s } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const plant = plants[slug] ?? null;
  return {
    props: {
      plant,
    },
  };
};
