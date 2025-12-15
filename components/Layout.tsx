"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { restoreCart } from "../store/cartSlice";
import { RootState } from "../store";

import styles from "./layout.module.css";

import { CheckoutContext } from "./CheckoutContext";


const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const [open, setOpen] = useState(false); // mini cart open
  const [checkoutOpen, setCheckoutOpen] = useState(false); // checkout modal
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(restoreCart());
  }, [dispatch]);

  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  // Open checkout from mini-cart "Оформить заказ" button
  const openCheckout = () => {
    setOpen(false); // optional: close mini cart
    setPhone("");
    setPhoneError(null);
    setCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
  };

  // simple validator
  const validatePhone = (value: string) => {
    if (!phoneRegex.test(value)) {
      setPhoneError("Неверный формат. Ожидается: +7(XXX)XXX-XX-XX");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  // const handleSendPlaceholder = () => {
  //   if (!validatePhone(phone)) {
  //     return;
  //   }
  //   // placeholder action: show summary and phone
  //   const summary = items
  //     .filter((it) => it.quantity > 0)
  //     .map((it) => `${it.title} (${it.age}) — ${it.quantity} шт. — ${it.price} ₽`)
  //     .join("\n");

  //   alert("Заглушка отправки:\n\n" + summary + `\n\nИтог: ${totalPrice} ₽\nТелефон: ${phone}`);
  //   console.log("Checkout placeholder send", { summary, totalPrice, phone });

  //   // close modal after send (optional)
  //   // setCheckoutOpen(false);
  // };

  const sendOrder = async () => {
  const response = await fetch("/api/send-order", {
    method: "POST",
    body: JSON.stringify({
      phone,
      // items: cartItems,
      items: items,
      totalPrice,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    alert("Ваш заказ отправлен! Мы свяжемся с вами.");
    setPhone("");
    // setCartModal(false);
    setCheckoutOpen(false);
  } else {
    alert("Ошибка отправки. Попробуйте позже.");
  }
};


  return (
    <CheckoutContext.Provider value={{ openCheckout }}>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand">Питомник растений</Link>

          <div className={styles.navRow}>
            <Link href="/" className="brand">Главная</Link>
            <Link href="/aboutUs" className="brand">О нас</Link>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* <button className={styles.cartButton} onClick={() => setOpen(true)}>
                Корзина 🛒
                {totalQty > 0 && <span className={styles.cartCount}>{totalQty}</span>}
              </button> */}
              <Link href="/cart" className={styles.cartButton} style={{textDecoration: 'none'}}>Корзина 🛒
                {totalQty > 0 && <span className={styles.cartCount}>{totalQty}</span>}
              </Link>

              {/* мини-попап */}
              {/* {open && (
                <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
                  <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ margin: 0 }}>Корзина</h3>
                      <button className={styles.modalCloseIcon} onClick={() => setOpen(false)}>×</button>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      {items.length === 0 && <p>Корзина пуста</p>}
                      {items.map((item) =>
                        item.quantity > 0 ? (
                          <div key={item.slug + item.age} className={styles.cartItem}>
                            <div className="meta">
                              <div className="title">{item.title}</div>
                              <div className="age">Возраст: {item.age}</div>
                            </div>
                            <div className="qty">{item.quantity} шт.</div>
                          </div>
                        ) : null
                      )}

                      {items.length > 0 && (
                        <>
                          <div className={styles.modalTotal}>Итого: <strong>{totalPrice} ₽</strong></div>

                          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                            <Link href="/cart" className={styles.goCart}>Перейти в корзину →</Link>
                            <button className={styles.orderButton} onClick={openCheckout}>Оформить заказ</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </header>

      <main className="container main-content">{children}</main>

      <footer id="contacts" className="site-footer">
        <div className="container footer-inner">
          <div>© Питомник растений — демонстрационный сайт</div>
          <div>Тел: +7 (900) 000-00-00 · Email: info@example.com</div>
        </div>
      </footer>

      {/* === CHECKOUT MODAL (центральный) === */}
      {checkoutOpen && (
        <div className={styles.checkoutOverlay} onClick={closeCheckout}>
          <div className={styles.checkoutWindow} onClick={(e) => e.stopPropagation()}>
            <div className={styles.checkoutHeader}>
              <div className={styles.checkoutTitle}>Оформление заказа</div>
              <button className={styles.checkoutCloseBtn} onClick={closeCheckout}>×</button>
            </div>

            <div>
              {items.filter(it => it.quantity > 0).length === 0 ? (
                <p>Ваша корзина пуста.</p>
              ) : (
                <>
                  <div className={styles.checkoutList}>
                    {items.filter(it => it.quantity > 0).map((it) => (
                      <div key={it.slug + it.age} className={styles.checkoutItem}>
                        <div className="meta">
                          <div className="title">{it.title}</div>
                          <div className="age">Возраст: {it.age}</div>
                        </div>
                        <div className="qty">{it.quantity} × {it.price} ₽</div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.checkoutTotal}>Итог: {totalPrice} ₽</div>

                  <div className={styles.phoneRow}>
                    <label htmlFor="phone">Телефон (формат +7(XXX)XXX-XX-XX)</label>
                    <input
                      id="phone"
                      className={styles.phoneInput}
                      placeholder="+7(900)000-00-00"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneError) validatePhone(e.target.value);
                      }}
                    />
                    <div className={styles.helpText}>
                      Введите номер телефона для обратной связи, мы Вам перезвоним!
                    </div>
                    {phoneError && <div style={{ color: "crimson", marginTop: 6 }}>{phoneError}</div>}

                    {/* <button
                      className={styles.sendButton}
                      onClick={handleSendPlaceholder}
                    >
                      Отправить
                    </button> */}
                    <button className={styles.sendButton} onClick={sendOrder}>
                      Отправить
                    </button>

                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </CheckoutContext.Provider>
  );
};

export default Layout;
