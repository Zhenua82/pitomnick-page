"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { restoreCart } from "@/store/cartSlice";
// import type { CartItem } from "@/store/cartSlice";

import styles from "./layout.module.css";
import { CheckoutContext } from "./CheckoutContext";
import ModalZakaz from "./modalZakaz";

/* =========================
   Constants
========================= */

const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;

/* =========================
   Component
========================= */

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  /* =========================
     Save cart to localStorage
  ========================= */

  useEffect(() => {
    dispatch(restoreCart());
  }, [dispatch]);


  /* =========================
     Derived values
  ========================= */

  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  /* =========================
     Checkout handlers
  ========================= */

  const openCheckout = () => {
    setPhone("");
    setPhoneError(null);
    setCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
  };

  const validatePhone = (value: string) => {
    if (!phoneRegex.test(value)) {
      setPhoneError("Неверный формат. Ожидается: +7(XXX)XXX-XX-XX");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const sendOrder = async () => {
    if (!validatePhone(phone)) return;

    // const response = await fetch("/pitomnick-page/api/send-order", {
    const response = await fetch("/api/send-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        items,
        totalPrice,
      }),
    });

    if (response.ok) {
      alert("Ваш заказ отправлен! Мы свяжемся с вами.");
      setPhone("");
      setCheckoutOpen(false);
    } else {
      alert("Ошибка отправки. Попробуйте позже.");
    }
  };

  /* =========================
     Render
  ========================= */

  return (
    <CheckoutContext.Provider value={{ openCheckout }}>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand">
            Питомник растений
          </Link>

          <div className={styles.navRow}>
            <Link href="/" className="brand">
              Главная
            </Link>
            <Link href="/aboutUs" className="brand">
              О нас
            </Link>

            <Link
              href="/cart"
              className={styles.cartButton}
              style={{ textDecoration: "none" }}
            >
              <span className={styles.korzina}>Корзина</span> 🛒
              {totalQty > 0 && (
                <span className={styles.cartCount}>{totalQty}</span>
              )}
            </Link>
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

      <ModalZakaz
        checkoutOpen={checkoutOpen}
        closeCheckout={closeCheckout}
        items={items}
        totalPrice={totalPrice}
        phone={phone}
        phoneError={phoneError}
        setPhone={setPhone}
        validatePhone={validatePhone}
        sendOrder={sendOrder}
      />
    </CheckoutContext.Provider>
  );
};

export default Layout;
