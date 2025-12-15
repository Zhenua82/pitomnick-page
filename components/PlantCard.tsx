import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Image from "next/image";

type Props = {
  slug: string;
  title: string;
  image: string;
  opisanie: string;
};

const PlantCard: React.FC<Props> = ({ slug, title, image, opisanie }) => {
  return (
    <article className={styles.card}>
      <Link href={`/plants/${slug}`} className={styles.cardLink}>
        <div className={styles.thumbWrap}>
          {/* <img src={image} alt={`${title} взрослое растение`} className={styles.thumb} /> */}
          <Image
                            src={image}
                            alt={`${title} — взрослое растение`}
                            width={800}
                            height={600}
                            className={styles.thumb}
                          />
        </div>
        <h3>{title}</h3>
        <p className={styles.cardDesc}>{opisanie}</p>
      </Link>
    </article>
  );
};

export default PlantCard;
