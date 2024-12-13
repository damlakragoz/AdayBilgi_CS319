import React from "react";
import "./FairInvitationsPage.css";

const fairInvitations = [
    { id: 1, status: "Onay bekleniyor", date: "25.08.2024", time: "15:30-16:30", canCancel: true },
    { id: 2, status: "Onay bekleniyor", date: "24.08.2024", time: "11:30-12:30", canCancel: true },
    { id: 3, status: "Onay bekleniyor", date: "21.07.2024", time: "10:30-11:30", canCancel: true },
    { id: 4, status: "Reddedildi", date: "20.07.2024", time: "15:30-16:30", canCancel: false },
    { id: 5, status: "Reddedildi", date: "14.07.2024", time: "14:30-15:30", canCancel: false },
    { id: 6, status: "Reddedildi", date: "13.07.2024", time: "14:30-15:20", canCancel: false },
];

const FairInvitationsPage = () => {
    const handleCancel = (id) => {
        alert(`Fuar Davetiyesi ${id} iptal edildi!`);
    };

    return (
        <div className="fair-invitations-container">
            <h2 className="fair-invitations-header">Fuar Davetlerim</h2>
            <table className="fair-invitations-table">
                <thead>
                <tr>
                    <th>Durum</th>
                    <th>Tarih</th>
                    <th>Saat</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {fairInvitations.map((invitation, index) => (
                    <tr
                        key={invitation.id}
                        className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}
                    >
                        <td>{invitation.status}</td>
                        <td>{invitation.date}</td>
                        <td>{invitation.time}</td>
                        <td>
                            {invitation.canCancel ? (
                                <button
                                    className="cancel-button active"
                                    onClick={() => handleCancel(invitation.id)}
                                >
                                    İptal Et
                                </button>
                            ) : (
                                <button className="cancel-button disabled" disabled>
                                    İptal Et
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination">
                <button className="pagination-button">&laquo;</button>
                <button className="pagination-button">&lsaquo;</button>
                <button className="pagination-button">&rsaquo;</button>
                <button className="pagination-button">&raquo;</button>
            </div>
        </div>
    );
};

export default FairInvitationsPage;
