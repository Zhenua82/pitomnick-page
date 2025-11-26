import React, { useEffect } from 'react';
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeItem, clearCart, restoreCart } from '../store/cartSlice';
import { RootState } from '../store';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    dispatch(restoreCart());
  }, [dispatch]);

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand">Питомник растений</Link>

        <nav className="nav">
            <Link href="/">Главная</Link>
            <Link href="/cart">Корзина</Link>
          <div>
            {items.map((item) => (
              item.quantity > 0 && (<div key={item.slug + item.age}>
                  <h5>{item.title}, возраст: {item.age} - {item.quantity} шт.</h5>    
              </div>)
            ))}
          </div>
          <div >
            <h3>Итого: {total} ₽</h3>
          </div>
        </nav>

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
