// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../store/store";
// import { updateQuantity, clearCart } from "../store/cartSlice";
// import Layout from "../components/Layout";

// const CartPage = () => {
//   const items = useSelector((state: RootState) => state.cart.items);
//   const dispatch = useDispatch();

//   const total = items.reduce(
//     (sum, i) => sum + i.quantity * i.price,
//     0
//   );

//   const [phone, setPhone] = React.useState("");

//   return (
//     <Layout>
//       <h1>Корзина</h1>

//       {items.length === 0 && <p>Корзина пуста.</p>}

//       <div>
//         {items.map((item) => (
//           <div key={`${item.slug}-${item.age}`} style={{
//             display: "flex",
//             gap: "14px",
//             padding: "10px",
//             border: "1px solid #eee",
//             borderRadius: "10px",
//             marginBottom: "12px",
//             background: "#fff"
//           }}>
//             <img
//               src={item.photo}
//               alt=""
//               style={{ width: 120, height: 100, objectFit: "cover", borderRadius: 8 }}
//             />

//             <div style={{ flex: 1 }}>
//               <h3>{item.title} — {item.age}</h3>
//               <div>Цена: {item.price} руб</div>

//               <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
//                 <button
//                   onClick={() =>
//                     dispatch(updateQuantity({
//                       slug: item.slug,
//                       age: item.age,
//                       quantity: item.quantity - 1
//                     }))
//                   }
//                 >−</button>

//                 <span>{item.quantity}</span>

//                 <button
//                   onClick={() =>
//                     dispatch(updateQuantity({
//                       slug: item.slug,
//                       age: item.age,
//                       quantity: item.quantity + 1
//                     }))
//                   }
//                 >+</button>
//               </div>

//               <div style={{ marginTop: 6, fontWeight: 600 }}>
//                 Итого: {item.quantity * item.price} руб
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {items.length > 0 && (
//         <>
//           <h2>Общая стоимость: {total} руб</h2>

//           <label>Ваш телефон:</label>
//           <input
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             placeholder="+7..."
//             style={{
//               padding: "8px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//               width: "100%",
//               maxWidth: "280px",
//               marginBottom: "14px"
//             }}
//           />

//           <div style={{ display: "flex", gap: 10 }}>
//             <button className="btn">
//               <a
//                 href={`mailto:your-email@example.com?subject=Заказ растений&body=${encodeURIComponent(
//                   `Телефон: ${phone}\n\n` +
//                   items.map(i =>
//                     `${i.title} (${i.age}) × ${i.quantity} = ${i.quantity * i.price} руб`
//                   ).join("\n") +
//                   `\n\nИтого: ${total} руб`
//                 )}`}
//                 style={{ color: "white", textDecoration: "none" }}
//               >
//                 Оформить заказ
//               </a>
//             </button>

//             <button
//               className="btn-ghost"
//               onClick={() => dispatch(clearCart())}
//             >
//               Очистить корзину
//             </button>
//           </div>
//         </>
//       )}
//     </Layout>
//   );
// };

// export default CartPage;


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { RootState } from '../store';
import { updateQuantity, removeItem, clearCart, restoreCart } from '../store/cartSlice';
import styles from '../styles/Cart.module.css';
import Link from 'next/link';
//Зажатие кнопок добавления и убавления товара:
import { useHoldButton } from "@/hooks/useHoldButton";
import { store } from "@/store";
import Head from 'next/head';
import Image from "next/image";
import ButtonOformitj from '@/components/buttonOformitj';
import { useRouter } from 'next/router';

//Переход на главную страницу:
const useNavigateToMain = () => {
  const router = useRouter();
  const perehodGlavn = () => {
    router.push('/');
  };
  return perehodGlavn;
};

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    dispatch(restoreCart());
  }, [dispatch]);

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  //Зажатие кнопок добавления и убавления товара:
  const { start: startHold, stop: stopHold } = useHoldButton();

  //Переход на главную страницу:
  const perehodGlavn = useNavigateToMain();

  return (
    <Layout>
      <Head>
        <title>Корзина покупок в питомнике хвойных растений в Анапе</title>
        <meta
          name="description" content="Описание корзины покупок в питомнике хвойных растений в Анапе"
        />
      </Head>
      <h1>Корзина</h1>

      {items.length === 0 ? (
        <p style={{ marginTop: 20 }}>
          Корзина пуста. <Link href="/" style={{ color: '#2f855a' }}>Перейти к растениям</Link>
        </p>
      ) : (
        <>
          <div className={styles.list}>
            {items.map((item) => (
              <div key={item.slug + item.age} className={styles.card}>
                {/* <img src={item.photo} alt={item.title} className={styles.photo} /> */}
                <Image
                                  src={item.photo}
                                  alt={`${item.title} — ${item.age}`}
                                  width={300}
                                  height={400}
                                  priority={item.age === item.age} 
                                  className={styles.photo}
                                />

                <div className={styles.info}>
                  <h3>{item.title}</h3>
                  <p className={styles.age}>Возраст: {item.age}</p>

                  <p className={styles.price}>
                    Цена: <strong>{item.price} ₽</strong>
                  </p>

                  <div className={styles.qtyRow}>
                    {/* <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            slug: item.slug,
                            age: item.age,
                            qty: Math.max(0, item.quantity - 1),
                          })
                        )
                      }
                    >
                      −
                    </button> */}
                    <button
                      onMouseDown={() =>
                        startHold(() => {
                          const current = store.getState().cart.items.find(
                            i => i.slug === item.slug && i.age === item.age
                          )?.quantity ?? 0;

                          dispatch(
                            updateQuantity({
                              slug: item.slug,
                              age: item.age,
                              qty: Math.max(0, current - 1),
                            })
                          );
                        })
                      }

                      onMouseUp={stopHold}
                      onMouseLeave={stopHold}
                      onTouchStart={() =>
                        startHold(() =>
                          dispatch(
                            updateQuantity({
                              slug: item.slug,
                              age: item.age,
                              qty: Math.max(0, item.quantity - 1),
                            })
                          )
                        )
                      }
                      onTouchEnd={stopHold}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    {/* <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            slug: item.slug,
                            age: item.age,
                            qty: Math.min(1000, item.quantity + 1),
                          })
                        )
                      }
                    >
                      +
                    </button> */}
                    <button
                      onMouseDown={() =>
                        startHold(() => {
                          const current = store.getState().cart.items.find(
                            i => i.slug === item.slug && i.age === item.age
                          )?.quantity ?? 0;

                          dispatch(
                            updateQuantity({
                              slug: item.slug,
                              age: item.age,
                              qty: Math.min(1000, current + 1),
                            })
                          );
                        })
                      }
                      onMouseUp={stopHold}
                      onMouseLeave={stopHold}
                      onTouchStart={() =>
                        startHold(() =>
                          dispatch(
                            updateQuantity({
                              slug: item.slug,
                              age: item.age,
                              qty: Math.min(1000, item.quantity + 1),
                            })
                          )
                        )
                      }
                      onTouchEnd={stopHold}
                    >
                      +
                    </button>
                  </div>

                  <p className={styles.subtotal}>
                    Сумма: <strong>{item.quantity * item.price} ₽</strong>
                  </p>

                  <button
                    className={styles.remove}
                    onClick={() => dispatch(removeItem({ slug: item.slug, age: item.age }))}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totalBox}>
            <h2>Итого: {total} ₽</h2>
            <div className={styles.wrapbutton}> 
              <button className={styles.clearBtn} onClick={() => dispatch(clearCart())}>
                Очистить корзину
              </button>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className={styles.addButton} onClick={perehodGlavn}>Добавить товар в корзину</button>
              </div>
              <ButtonOformitj/>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CartPage;