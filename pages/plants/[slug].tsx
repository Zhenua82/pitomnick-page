// /pages/plants/[slug].tsx
import Layout from '../../components/Layout';
import { plants, Plant } from '../../data/plants';
import styles from '../../styles/Plant.module.css';
import Link from 'next/link';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';

type Props = {
  plant: Plant | null;
};

const PlantPage: React.FC<Props> = ({ plant }) => {

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
          {ages.map(age => (
            <figure key={age} className={styles.figure}>
                <img src={plant.photo[age]} alt={`${plant.title} — ${age}`} />
                <figcaption>
                <strong>{age}</strong>
                <div className={styles.price}>{plant.cena[age]}</div>
                </figcaption>              
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
// Статическая генерация путей:
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = Object.keys(plants);
  const paths = slugs.map((s) => ({ params: { slug: s } }));
  return { paths, fallback: false };
};

// Получение данных для каждой страницы:
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const plant = plants[slug] ?? null;
  return {
    props: {
      plant,
    },
  };
};
