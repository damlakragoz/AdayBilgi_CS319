import React from "react";
import "./Payments.css";

const Payments = () => {
  const payments = [
    { id: 1, amount: "280 TL", duration: "3 Saat", paid: false },
    { id: 2, amount: "120 TL", duration: "2 Saat", paid: true },
    { id: 3, amount: "160 TL", duration: "1 Saat", paid: true },
  ];

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h2>Kasım Ayı Aktivite Ödeme Bilgileri</h2>
        <select className="month-select">
          <option>Ay seç</option>
          <option>Kasım</option>
          <option>Aralık</option>
          <option>Ocak</option>
        </select>
      </div>
      <div className="payments-table">
        <div className="table-header">
          <span>Ödenme Durumu</span>
          <span>Ödenecek Miktar</span>
          <span>Geçirilen Süre (Turlar için: **)</span>
        </div>
        {payments.map((payment) => (
          <div
            key={payment.id}
            className={`payment-row ${payment.paid ? "paid" : ""}`}
          >
            <input type="checkbox" checked={payment.paid} readOnly />
            <span>{payment.amount}</span>
            <span>{payment.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payments;
