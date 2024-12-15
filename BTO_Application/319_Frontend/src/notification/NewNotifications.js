import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./NewNotifications.css";

const NewNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [activeFilter, setActiveFilter] = useState("Hepsi");
    const [expandedNotifications, setExpandedNotifications] = useState(new Set()); // Track expanded notifications
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filterButtons = ["Hepsi", "Okunmamışlar", "Arşivlenmişler"];
    const receiverName = localStorage.getItem("username");

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!receiverName) return;

            let url = "http://localhost:8081/api/notifications/all";
            if (activeFilter === "Okunmamışlar") {
                url = "http://localhost:8081/api/notifications/unread";
            } else if (activeFilter === "Arşivlenmişler") {
                url = "http://localhost:8081/api/notifications/flagged";
            }

            try {
                const response = await axios.get(url, { params: { receiverName } });
                setNotifications(response.data);
                setCurrentPage(1);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [activeFilter, receiverName]);

    // Paginate notifications
    const paginatedNotifications = notifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Toggle Expand/Collapse
    const toggleExpand = async (notificationId) => {
        setExpandedNotifications((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(notificationId)) {
                newSet.delete(notificationId);
            } else {
                newSet.add(notificationId);
            }
            return newSet;
        });

        // Mark as read if expanded
        try {
            await axios.put("http://localhost:8081/api/notifications/mark-as-read", null, {
                params: { notificationId },
            });
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Toggle Archive
    const toggleFlag = async (notificationId, isFlagged) => {
        const url = isFlagged
            ? "http://localhost:8081/api/notifications/unflag"
            : "http://localhost:8081/api/notifications/flag";
        try {
            await axios.put(url, null, { params: { notificationId } });
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, isFlagged: !isFlagged } : n
                )
            );
        } catch (error) {
            console.error("Error updating flag status:", error);
        }
    };

    // Delete Notification
    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete("http://localhost:8081/api/notifications/delete", { params: { notificationId } });
            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    return (
        <div className="notifications-page-container">
            {/* Header */}
            <h2 className="notifications-header">Bildirimlerim</h2>

            {/* Filter Buttons */}
            <div className="filter-buttons">
                {filterButtons.map((filter) => (
                    <button
                        key={filter}
                        className={`filter-button ${activeFilter === filter ? "active" : ""}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
                {paginatedNotifications.length > 0 ? (
                    paginatedNotifications.map((notification) => (
                        <div key={notification.id} className={`notification-card ${notification.isRead ? "read" : "unread"}`}>
                            <div className="notification-details-container">
                                <h2 className="notification-title">{notification.title}</h2>
                                {/* See More Link */}
                                {expandedNotifications.has(notification.id) && (
                                    <p className="notification-details">{notification.text}</p>
                                )}
                                <button
                                    className="see-more-button"
                                    onClick={() => toggleExpand(notification.id)}
                                >
                                    {expandedNotifications.has(notification.id)
                                        ? "Daha Az Göster"
                                        : "Daha Fazla Göster"}
                                </button>
                            </div>
                            <div className="notification-top-right">
                                <span className="notification-date">
                                    {new Date(notification.timestamp).toLocaleString()}
                                </span>
                                <div className="notification-actions">
                                    <button
                                        onClick={() => toggleFlag(notification.id, notification.isFlagged)}
                                        className={notification.isFlagged ? "archive-flagged" : ""}
                                    >
                                        <FontAwesomeIcon icon={faArchive} />
                                    </button>
                                    <button onClick={() => deleteNotification(notification.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Herhangi bir bildiriminiz bulunmamaktadır.</p>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button
                    className="pagination-button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                    Önceki
                </button>
                <button
                    className="pagination-button"
                    disabled={currentPage * itemsPerPage >= notifications.length}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                    Sonraki
                </button>
            </div>

            {/* Footer */}
            <div className="notifications-footer">
                Sayfa {currentPage} / {paginatedNotifications.length === 0 ? 1 : Math.ceil(notifications.length / itemsPerPage)}
            </div>
        </div>
    );
};

export default NewNotifications;
