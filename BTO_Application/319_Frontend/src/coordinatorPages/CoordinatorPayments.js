import React, { useState, useEffect } from "react";
import axios from "axios";
import "../coordinatorPages/CoordinatorPayments.css";

const CoordinatorPayments = () => {
    const [allPayments, setAllPayments] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const token = localStorage.getItem("userToken");
    const coordinatorEmail = localStorage.getItem("username");

    const translateStatus = (status) => {
        switch (status) {
            case "PENDING":
                return "Onay Bekliyor";
            case "APPROVED":
                return "Onaylandı";
            case "UPDATED":
                return "Güncellendi";
            default:
                return status; // Eğer farklı bir durum varsa orijinal haliyle döner
        }
    };
    // Tüm ödeme bilgilerini getir
    const fetchAllPayments = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/payments/getAll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAllPayments(response.data);
        } catch (error) {
            console.error("Error fetching all payments:", error);
        }
    };

    // Bekleyen ödemeleri getir
    const fetchPendingPayments = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/payments/pending/getAll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPendingPayments(response.data);
        } catch (error) {
            console.error("Error fetching pending payments:", error);
        }
    };

    // Ödemeyi onayla
    const approvePayment = async (paymentId) => {
        try {
            const response = await axios.put(
                `http://localhost:8081/api/coordinator/approve-payment`,
                null,
                {
                    params: {
                        paymentId: paymentId,
                        coordinatorEmail: coordinatorEmail,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("Payment approved successfully!");
                fetchPendingPayments();
                fetchAllPayments();
            }
        } catch (error) {
            console.error("Error approving payment:", error);
            alert("Failed to approve payment.");
        }
    };

    // İlk yüklemede tüm ödemeleri ve bekleyen ödemeleri getir
    useEffect(() => {
        fetchAllPayments();
        fetchPendingPayments();
    }, []);

    return (
        <div className="pending-payments-main-container">
            <h1 className="pending-payments-header-main">ÖDEMELER</h1>

            <h2 className="pending-payments-header">BEKLEYEN ÖDEMELER</h2>
            {pendingPayments.length > 0 ? (
                <table className="pending-payments-table">
                    <thead>
                    <tr>
                        <th>Ödeme ID</th>
                        <th>Miktar</th>
                        <th>Durum</th>
                        <th>Aksiyon</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pendingPayments.map((payment) => (
                        <tr key={payment.id}>
                            <td>{payment.id}</td>
                            <td>{payment.amount}</td>
                            <td>{translateStatus(payment.status)}</td>
                            <td>
                                <button
                                    className="pending-payments-approve-btn"
                                    onClick={() => approvePayment(payment.id)}
                                >
                                    Approve
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Bekleyen Ödeme Bulunamadı</p>
            )}

            <h2 className="pending-payments-header">TÜM ÖDEMELER</h2>
            {allPayments.length > 0 ? (
                <table className="pending-payments-table">
                    <thead>
                    <tr>
                        <th>Ödeme ID</th>
                        <th>Miktar</th>
                        <th>Durum</th>
                        <th>Onaylayan Kişi</th>
                        <th>Onaylanma Tarihi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allPayments.map((payment) => (
                        <tr key={payment.id}>
                            <td>{payment.id}</td>
                            <td>{payment.amount}</td>
                            <td>{translateStatus(payment.status)}</td>
                            <td>{payment.approvedBy || "N/A"}</td>
                            <td>{payment.approvalDate || "N/A"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Ödeme Bulunamadı</p>
            )}
        </div>
    );
};

export default CoordinatorPayments;