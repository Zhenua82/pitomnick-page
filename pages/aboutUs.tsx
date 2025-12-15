// import YandexMap from '@/components/YandexMap';

// export default function AboutUs() {

//   return (
//     <>
//       <h1>О нас:</h1>
//       <YandexMap/>
//     </>
//   );
// }
import React from 'react';
import YandexMap from '@/components/YandexMap';
import styles from '@/styles/About.module.css';
import Layout from '@/components/Layout';
import Head from 'next/head';
import CartSmall from '@/components/cartSmall';
import PhoneButton from '@/components/phoneButton';

const AboutPage: React.FC = () => {
  return (
    <Layout>
        <Head>
        <title>Страница о питомнике хвойных растений в Анапе</title>
        <meta
          name="description" content="Описание питомника хвойных растений в Анапе"
        />
      </Head>
    <main className={styles.container}>
      <section className={styles.header}>
        <h1>О нас</h1>
        <p className={styles.subtitle}>
          Добро пожаловать в наш питомник хвойных растений — уголок природы и зелени!
        </p>
      </section>

      <section className={styles.content}>
        <article className={styles.text}>
          <h2>Наша миссия</h2>
          <p>
            Мы выращиваем и заботимся о самых красивых и здоровых хвойных растениях,
            чтобы дарить вам возможность окружить себя природной свежестью и уютом.
            В нашем питомнике вы найдете широкий выбор сосен, елей, пихт и других
            вечнозеленых красавцев.
          </p>

          <h2>Наше расположение</h2>
          <p>
            Мы находимся недалеко от Анапы и рады видеть вас в нашем питомнике по адресу,
            который вы можете увидеть на карте ниже.
          </p>

          <h2>Почему выбирают нас</h2>
          <ul>
            <li>Высокое качество и сорта растений</li>
            <li>Индивидуальный подход к каждому клиенту</li>
            <li>Консультации по уходу за хвойниками</li>
            <li>Доставка и посадка на месте</li>
          </ul>
        </article>

        <aside className={styles.mapWrapper}>
          <YandexMap />
        </aside>
      </section>

      <section className={styles.info}>
        <div><CartSmall/></div>
        <div className={styles.buttonPhone}>
          <PhoneButton/>
        </div>
      </section>
    </main>
    
    </Layout>
  );
};

export default AboutPage;