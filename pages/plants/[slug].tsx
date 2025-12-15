// /pages/plants/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { plants, Plant } from '../../data/plants';
import styles from '../../styles/Plant.module.css';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../store/cartSlice';
import { RootState } from '@/store';
//Зажатие кнопок добавления и убавления товара:
import { useHoldButton } from "@/hooks/useHoldButton";
import Head from 'next/head';
import CartSmall from '@/components/cartSmall';
import PhoneButton from '@/components/phoneButton';
import Image from "next/image";


type Props = {
  plant: Plant | null;
};

const PlantPage: React.FC<Props> = ({ plant }) => {
    const dispatch = useDispatch();
    const [qty, setQty] = React.useState<Record<string, number>>({});
    const ages = plant
      ? (Object.keys(plant.photo) as Array<keyof typeof plant.photo>)
          .filter((a) => a !== 'взрослое растение')
      : [];
//Забираем колличество товара из локалсторадж:
const cartItems = useSelector((state: RootState) => state.cart.items);
useEffect(() => {
    if (plant) {
      const initialQty: Record<string, number> = {};
      ages.forEach(age => {
        const item = cartItems.find(
          i => i.slug === plant!.slug && i.age === age
        );
        initialQty[age] = item ? item.quantity : 0;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQty(initialQty);
    }
  }, [cartItems, plant, ages]);
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

  return (
    <Layout>
      <Head>
        <title>{plant.title} — купить саженцы в питомнике Анапы</title>
        <meta
          name="description" content={`Покупайте саженцы "${plant.title}" в питомнике Анапы. Высокое качество, гарантированная доставка. Заказывайте прямо сейчас!`}
        />
      </Head>
      <div className={styles.header}>
        <h1>{plant.title}:</h1>
          <p>{plant.podrobnoeOpisanie1}</p>
      </div>

      <div className={styles.content}>
        <section className={styles.gallery}>
          {ages.map(age => (
            <figure key={age} className={styles.figure}>
                <Image
                  src={plant.photo[age]}
                  alt={`${plant.title} — ${age}`}
                  width={800}
                  height={600}
                  priority={age === '1 летннее растение'} 
                />

                <figcaption>
                <strong>{age}</strong>
                <div className={styles.price}>{plant.cena[age]}</div>
                </figcaption>
                {/* управление количеством */}
                {/* уменьшение */}
            <button
              className={styles.minus}
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
              className={styles.plus}
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
          {/* <button>Позвонить</button> */}
          <div className={styles.figure} style={{height: '100%', textAlign: 'center'}} > 
            <Image
                  style={{height: '94%'}}
                  src={plant.photo['взрослое растение']}
                  alt={`${plant.title} — взрослое растение`}
                  width={800}
                  height={600}
                />             
            <strong style={{color: '#6b7280', fontSize: '.95rem'}}>{'взрослое растение'}</strong>
          </div>
        </section>
        <section className={styles.details}>
            <CartSmall/>
            <PhoneButton/>
        </section>
      </div>
      <div className={styles.header}>
          <p>{plant.podrobnoeOpisanie2}</p>
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
