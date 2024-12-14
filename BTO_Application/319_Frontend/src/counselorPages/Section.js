import React from "react";
import { Link } from "react-router-dom";

const Section = ({ title, data, type, editAction }) => {
    return (
        <div className="card mb-5">
            <div
                className="card-header"
                style={{
                    backgroundColor: "#6082B6",
                    color: "white",
                    borderRadius: "4px",
                }}
            >
                {title}
            </div>
            <div className="card-body">
                <table className="table">
                    <thead>
                    {type === "applications" && (
                        <tr>
                            <th>Durum</th>
                            <th>Tarih</th>
                            <th>Saat</th>
                            <th></th>
                        </tr>
                    )}
                    {type === "feedbacks" && (
                        <tr>
                            <th>Durum</th>
                            <th>Aktivite</th>
                            <th>Tarih</th>
                            <th>Saat</th>
                            <th>Oy</th>
                            <th>Geri Bildirim</th>
                        </tr>
                    )}
                    {type === "invitations" && (
                        <tr>
                            <th>Durum</th>
                            <th>Tarih</th>
                            <th>Saat</th>
                        </tr>
                    )}
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {type === "applications" && (
                                <>
                                    <td>{item.status}</td>
                                    <td>{item.date}</td>
                                    <td>{item.time}</td>
                                    <td>
                                        {item.action ? (
                                            <a
                                                href="#"
                                                className="btn btn-sm"
                                                style={{
                                                    backgroundColor: "#DA1E28",
                                                    color: "white",
                                                    border: "none",
                                                }}
                                            >
                                                {item.action}
                                            </a>
                                        ) : null}
                                    </td>
                                </>
                            )}
                            {type === "feedbacks" && (
                                <>
                                    <td>{item.status}</td>
                                    <td>{item.activity}</td>
                                    <td>{item.date}</td>
                                    <td>{item.time}</td>
                                    <td>
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                                key={i}
                                                className={`fas fa-star ${
                                                    i < item.stars
                                                        ? "text-warning"
                                                        : "text-secondary"
                                                }`}
                                            ></i>
                                        ))}
                                    </td>
                                    <td>
                                        <Link to="/feedback">
                                            <i
                                                className="fas fa-pen"
                                                style={{ color: "#004080", cursor: "pointer" }}
                                            ></i>
                                        </Link>
                                    </td>
                                </>
                            )}
                            {type === "invitations" && (
                                <>
                                    <td>{item.status}</td>
                                    <td>{item.date}</td>
                                    <td>{item.time}</td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <button
                            className="btn btn-link"
                            style={{ color: "#004080" }}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                            className="btn btn-link"
                            style={{ color: "#004080" }}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    {editAction && (
                        <a
                            href="#"
                            className="btn"
                            style={{
                                backgroundColor: "#F0E68C",
                                color: "black",
                                border: "none",
                            }}
                        >
                            {editAction}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Section;
