import { GetStaticPaths, GetStaticProps } from "next";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Layout from "../../components/Layout";
import { plants, Plant, AgeKey } from "../../data/plants";
import styles from "../../styles/Plant.module.css";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { RootState } from "@/store";
import { useHoldButton2 } from "@/hooks/useHoldButton2";
import Head from "next/head";
import CartSmall from "@/components/cartSmall";
import PhoneButton from "@/components/phoneButton";
import Image from "next/image";

type Props = {
  plant: Plant | null;
};

const PlantPage: React.FC<Props> = ({ plant }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const ages = useMemo<AgeKey[]>(() => {
    if (!plant) return [];
    return (Object.keys(plant.photo) as AgeKey[]).filter(
      (a) => a !== "взрослое растение"
    );
  }, [plant]);

  const [qty, setQty] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const { start, stop } = useHoldButton2();

  /** инициализация qty из корзины */
  useEffect(() => {
    if (!plant) return;

    const initial: Record<string, number> = {};
    for (const age of ages) {
      const item = cartItems.find(
        (i) => i.slug === plant.slug && i.age === age
      );
      initial[age] = item?.quantity ?? 0;
    }

    setQty(initial);
  }, [plant, ages, cartItems]);

  const updateCart = useCallback(
    (age: AgeKey, newQty: number) => {
      if (!plant) return;

      dispatch(
        addItem({
          slug: plant.slug,
          age,
          title: plant.title,
          photo: plant.photo[age],
          price: parseInt(plant.cena[age].replace(/\D/g, ""), 10),
          quantity: newQty,
        })
      );

      setAdded((p) => ({ ...p, [age]: true }));
      setTimeout(() => {
        setAdded((p) => ({ ...p, [age]: false }));
      }, 800);
    },
    [dispatch, plant]
  );

  if (!plant) {
    return (
      <Layout>
        <h2>Растение не найдено</h2>
        <Link href="/">Вернуться на главную</Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{plant.title} — купить саженцы</title>
        <meta
          name="description"
          content={`Покупайте ${plant.title} в питомнике`}
        />
      </Head>

      <div className={styles.header}>
        <h1>{plant.title}</h1>
        <p>{plant.podrobnoeOpisanie1}</p>
      </div>

      <div className={styles.content}>
        <section className={styles.gallery}>
          {ages.map((age) => (
            <figure key={age} className={styles.figure}>
              <Image
                src={plant.photo[age]}
                alt={`${plant.title} — ${age}`}
                width={800}
                height={600}
                priority={false}
              />

              <figcaption>
                <strong>{age}</strong>
                <div className={styles.price}>{plant.cena[age]}</div>
              </figcaption>

              <button
                className={styles.minus}
                onMouseDown={() =>
                  start(() => {
                    setQty((p) => {
                      const n = Math.max(0, (p[age] || 0) - 1);
                      updateCart(age, n);
                      return { ...p, [age]: n };
                    });
                  })
                }
                onMouseUp={stop}
                onMouseLeave={stop}
              >
                −
              </button>

              <span>{qty[age] || 0}</span>

              <button
                className={styles.plus}
                onMouseDown={() =>
                  start(() => {
                    setQty((p) => {
                      const n = Math.min(1000, (p[age] || 0) + 1);
                      updateCart(age, n);
                      return { ...p, [age]: n };
                    });
                  })
                }
                onMouseUp={stop}
                onMouseLeave={stop}
              >
                +
              </button>

              {added[age] && (
                <div className={styles.addedFloating}>Добавлено!</div>
              )}
            </figure>
          ))}

          <div className={styles.figure}>
            <Image
              src={plant.photo["взрослое растение"]}
              alt={`${plant.title} — взрослое растение`}
              width={800}
              height={600}
              priority={false}
            />
            <strong>взрослое растение</strong>
          </div>
        </section>

        <section className={styles.details}>
          <CartSmall />
          <PhoneButton />
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