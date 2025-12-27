import { GetStaticPaths, GetStaticProps } from "next";
import React, { useMemo } from "react";
import Layout from "../../components/Layout";
import { plants, Plant, AgeKey } from "../../data/plants";
import styles from "../../styles/Plant.module.css";
import Link from "next/link";
import Head from "next/head";
import PhoneButton from "@/components/phoneButton";
import Image from "next/image";

type Props = {
  plant: Plant | null;
};

const PlantPage: React.FC<Props> = ({ plant }) => {

  /* =========================
     Available ages
  ========================= */

  const ages = useMemo<AgeKey[]>(() => {
    if (!plant) return [];
    return (Object.keys(plant.photo) as AgeKey[]).filter(
      (a) => a !== "взрослое растение"
    );
  }, [plant]);

  
  /* =========================
     Guards
  ========================= */

  if (!plant) {
    return (
      <Layout>
        <h2>Растение не найдено</h2>
        <Link href="/">Вернуться на главную</Link>
      </Layout>
    );
  }

  /* =========================
     Render
  ========================= */

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
          {ages.map((age) => {

            return (
              <figure key={age} className={styles.figure}>
                <Image
                  src={plant.photo[age]}
                  alt={`${plant.title} — ${age}`}
                  width={300}
                  height={600}
                />

                <figcaption>
                  <strong>{age}</strong>
                  <div className={styles.price}>
                    {plant.cena[age]}
                  </div>
                </figcaption>
              </figure>
            );
          })}

          {/* adult plant */}
          <div className={styles.figure}>
            <Image
              src={plant.photo["взрослое растение"]}
              alt={`${plant.title} — взрослое растение`}
              width={300}
              height={600}
              priority
            />
            <strong>взрослое растение</strong>
          </div>
        </section>

        <section className={styles.details}>
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

/* =========================
   SSG
========================= */

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = Object.keys(plants);
  return {
    paths: slugs.map((s) => ({ params: { slug: s } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}) => {
  const slug = params?.slug as string;
  const plant = plants[slug] ?? null;

  return {
    props: {
      plant,
    },
  };
};
