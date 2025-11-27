// /pages/plants/[slug].tsx
import { GetStaticPaths, GetStaticProps } from "next";
import React, { useLayoutEffect, useState } from "react";
import Layout from "../../components/Layout";
import { plants, Plant, AgeKey } from "../../data/plants";
import styles from "../../styles/Plant.module.css";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { RootState } from "@/store";
import { useHoldButton2 } from "@/hooks/useHoldButton2";

type Props = {
  plant: Plant | null;
};

const PlantPage: React.FC<Props> = ({ plant }) => {
  // ❗ Все хуки строго в начале
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const { start, stop } = useHoldButton2();

  // Если plant отсутствует — НЕЛЬЗЯ делать return раньше хуков, поэтому создаём флаг:
  const notFound = !plant;

  // Если растение не найдено — просто рендерим ниже
  const ages = React.useMemo(() => {
    return plant ? (Object.keys(plant.photo) as AgeKey[]) : [];
  }, [plant]);


  // Восстанавливаем количество товара из корзины
  useLayoutEffect(() => {
    if (!plant) return;

    const initialQty: Record<string, number> = {};

    ages.forEach((age) => {
      const item = cartItems.find((i) => i.slug === plant.slug && i.age === age);
      initialQty[age] = item ? item.quantity : 0;
    });
    //Отключаем ненужную ошибку ts:
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setQty(initialQty);
  }, [cartItems, plant, ages]);


  // Автоматическое обновление корзины
  const updateCart = React.useCallback((age: string, newQty: number) => {
    if (!plant) return;
    // откладываем dispatch в microtask — он точно выполнится после завершения текущего рендера
    Promise.resolve().then(() => {
      dispatch(
        addItem({
          slug: plant.slug,
          age,
          title: plant.title,
          photo: plant.photo[age],
          quantity: newQty,
          price: parseInt(plant.cena[age], 10),
        })
      );
    });

    setAdded((prev) => ({ ...prev, [age]: true }));
    setTimeout(() => {
      setAdded((prev) => ({ ...prev, [age]: false }));
    }, 800);
  }, [dispatch, plant]);


  if (notFound) {
    return (
      <Layout>
        <h2>Растение не найдено</h2>
        <p>
          <Link href="/">Вернуться на главную</Link>
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.header}>
        <h1>{plant.title}</h1>
        <p className={styles.short}>{plant.opisanie}</p>
      </div>

      <div className={styles.content}>
        <section className={styles.gallery}>
          {ages.map((age) => (
            <figure key={age} className={styles.figure}>
              <img src={plant.photo[age]} alt={`${plant.title} — ${age}`} />

              <figcaption>
                <strong>{age}</strong>
                <div className={styles.price}>{plant.cena[age]}</div>
              </figcaption>

              {/* --- Уменьшение --- */}
              <button
                onMouseDown={() =>
                  start(() => {
                    setQty((prev) => {
                      const newQty = Math.max(0, (prev[age] || 0) - 1);
                      updateCart(age, newQty);
                      return { ...prev, [age]: newQty };
                    });
                  })
                }
                onMouseUp={stop}
                onMouseLeave={stop}
                onTouchStart={() =>
                  start(() => {
                    setQty((prev) => {
                      const newQty = Math.max(0, (prev[age] || 0) - 1);
                      updateCart(age, newQty);
                      return { ...prev, [age]: newQty };
                    });
                  })
                }
                onTouchEnd={stop}
              >
                −
              </button>

              {/* Количество */}
              <span>{qty[age] || 0}</span>

              {/* --- Увеличение --- */}
              <button
                onMouseDown={() =>
                  start(() => {
                    setQty((prev) => {
                      const newQty = Math.min(1000, (prev[age] || 0) + 1);
                      updateCart(age, newQty);
                      return { ...prev, [age]: newQty };
                    });
                  })
                }
                onMouseUp={stop}
                onMouseLeave={stop}
                onTouchStart={() =>
                  start(() => {
                    setQty((prev) => {
                      const newQty = Math.min(1000, (prev[age] || 0) + 1);
                      updateCart(age, newQty);
                      return { ...prev, [age]: newQty };
                    });
                  })
                }
                onTouchEnd={stop}
              >
                +
              </button>

              {/* Надпись "Добавлено!" */}
              {added[age] && (
                <div className={styles.addedFloating}>Добавлено!</div>
              )}
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
            <Link href="/" className="btn btn-ghost">
              Вернуться
            </Link>
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
    props: { plant },
  };
};




// Полностью правильно типизированный по ts вариант:
// import { GetStaticPaths, GetStaticProps } from "next";
// import React from "react";
// import Layout from "../../components/Layout";
// import { plants, Plant } from "../../data/plants";
// import styles from "../../styles/Plant.module.css";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { addItem } from "../../store/cartSlice";
// import { RootState } from "@/store";
// import { useHoldButton2 } from "@/hooks/useHoldButton2";
// import { AgeKey } from "../../data/plants";

// type Props = {
//   plant: Plant | null;
// };

// const PlantPage: React.FC<Props> = ({ plant }) => {
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state: RootState) => state.cart.items);

//   const [qty, setQty] = React.useState<Record<AgeKey, number>>({
//     "1 летннее растение": 0,
//     "2 летннее растение": 0,
//     "3 летннее растение": 0,
//     "4 летннее растение": 0,
//     "5 летннее растение": 0,
//   });

//   const [added, setAdded] = React.useState<Record<AgeKey, boolean>>({
//     "1 летннее растение": false,
//     "2 летннее растение": false,
//     "3 летннее растение": false,
//     "4 летннее растение": false,
//     "5 летннее растение": false,
//   });

//   const { start, stop } = useHoldButton2();

//   const notFound = !plant;

//   // ✔ Полностью корректно типизированный список возрастов
//   const ages = React.useMemo<AgeKey[]>(() => {
//     return plant ? (Object.keys(plant.photo) as AgeKey[]) : [];
//   }, [plant]);

//   // ✔ Загружаем qty из Redux один раз после загрузки данных
//   //   и никакой синхронной установки стейта!
//   React.useEffect(() => {
//     if (!plant) return;

//     // Берём значения из Redux только для нужного slug
//     const restored: Record<AgeKey, number> = { ...qty };

//     ages.forEach((age) => {
//       const item = cartItems.find(
//         (i) => i.slug === plant.slug && i.age === age
//       );
//       restored[age] = item ? item.quantity : 0;
//     });

//     // откладываем на microtask → не вызывает предупреждений React
//     Promise.resolve().then(() => setQty(restored));
//   }, [plant, cartItems, ages]);

//   // ✔ Безопасное обновление корзины без ошибок React
//   const updateCart = React.useCallback(
//     (age: AgeKey, newQty: number) => {
//       if (!plant) return;

//       Promise.resolve().then(() => {
//         dispatch(
//           addItem({
//             slug: plant.slug,
//             age,
//             title: plant.title,
//             photo: plant.photo[age],
//             quantity: newQty,
//             price: parseInt(plant.cena[age], 10),
//           })
//         );
//       });

//       setAdded((prev) => ({ ...prev, [age]: true }));
//       setTimeout(() => {
//         setAdded((prev) => ({ ...prev, [age]: false }));
//       }, 800);
//     },
//     [dispatch, plant]
//   );

//   if (notFound) {
//     return (
//       <Layout>
//         <h2>Растение не найдено</h2>
//         <p>
//           <Link href="/">Вернуться на главную</Link>
//         </p>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className={styles.header}>
//         <h1>{plant.title}</h1>
//         <p className={styles.short}>{plant.opisanie}</p>
//       </div>

//       <div className={styles.content}>
//         <section className={styles.gallery}>
//           {ages.map((age) => (
//             <figure key={age} className={styles.figure}>
//               <img src={plant.photo[age]} alt={`${plant.title} — ${age}`} />

//               <figcaption>
//                 <strong>{age}</strong>
//                 <div className={styles.price}>{plant.cena[age]}</div>
//               </figcaption>

//               {/* ——— Кнопка уменьшения ——— */}
//               <button
//                 onMouseDown={() =>
//                   start(() => {
//                     setQty((prev) => {
//                       const newQty = Math.max(0, prev[age] - 1);
//                       updateCart(age, newQty);
//                       return { ...prev, [age]: newQty };
//                     });
//                   })
//                 }
//                 onMouseUp={stop}
//                 onMouseLeave={stop}
//                 onTouchStart={() =>
//                   start(() => {
//                     setQty((prev) => {
//                       const newQty = Math.max(0, prev[age] - 1);
//                       updateCart(age, newQty);
//                       return { ...prev, [age]: newQty };
//                     });
//                   })
//                 }
//                 onTouchEnd={stop}
//               >
//                 −
//               </button>

//               {/* Количество */}
//               <span>{qty[age]}</span>

//               {/* ——— Кнопка увеличения ——— */}
//               <button
//                 onMouseDown={() =>
//                   start(() => {
//                     setQty((prev) => {
//                       const newQty = Math.min(1000, prev[age] + 1);
//                       updateCart(age, newQty);
//                       return { ...prev, [age]: newQty };
//                     });
//                   })
//                 }
//                 onMouseUp={stop}
//                 onMouseLeave={stop}
//                 onTouchStart={() =>
//                   start(() => {
//                     setQty((prev) => {
//                       const newQty = Math.min(1000, prev[age] + 1);
//                       updateCart(age, newQty);
//                       return { ...prev, [age]: newQty };
//                     });
//                   })
//                 }
//                 onTouchEnd={stop}
//               >
//                 +
//               </button>

//               {/* Всплывающая надпись */}
//               {added[age] && (
//                 <div className={styles.addedFloating}>Добавлено!</div>
//               )}
//             </figure>
//           ))}
//         </section>

//         <section className={styles.details}>
//           <h2>Подробное описание</h2>
//           <p>{plant.podrobnoeOpisanie}</p>

//           <h3>Цены</h3>
//           <ul>
//             {ages.map((age) => (
//               <li key={age}>
//                 <strong>{age}:</strong> {plant.cena[age]}
//               </li>
//             ))}
//           </ul>

//           <div className={styles.actions}>
//             <button className="btn">Заказать</button>
//             <Link href="/" className="btn btn-ghost">
//               Вернуться
//             </Link>
//           </div>
//         </section>
//       </div>
//     </Layout>
//   );
// };

// export default PlantPage;

// export const getStaticPaths: GetStaticPaths = async () => {
//   const slugs = Object.keys(plants);
//   const paths = slugs.map((s) => ({ params: { slug: s } }));
//   return { paths, fallback: false };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const slug = params?.slug as string;
//   const plant = plants[slug] ?? null;
//   return {
//     props: { plant },
//   };
// };
