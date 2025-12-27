"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./layout.module.css";


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <>
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
    </>
  );
};

export default Layout;
