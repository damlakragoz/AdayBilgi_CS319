import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Statistics.css";

const Statistics = () => {
    const [statisticsData, setStatisticsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("userToken");

    const endpoints = {
        userCounts: "userCounts",
        tourGuideByDepartment: "tourGuideCountByDepartment",
        tourGuideByGrade: "tourGuideCountByGrade",
        tourApplicationCountByStatus: "tourApplicationCountByStatus",
        tourApplicationCountByType: "tourApplicationCountByType",
        tourCountByHighSchool: "tourCountByHighSchool",
        highSchoolCountByCity: "highSchoolCountByCity",
        feedbackCountByRating: "feedbackCountByRating",
        fairInvitationCountByStatus: "fairInvitationCountByStatus",
    };

    const fetchStatistics = async () => {
        if (!token) {
            setError("Authorization token is missing. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const results = await Promise.all(
                Object.entries(endpoints).map(async ([key, endpoint]) => {
                    const response = await axios.get(`http://localhost:8081/api/statistics/${endpoint}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    return { key, data: response.data };
                })
            );

            const newStatisticsData = {};
            results.forEach(({ key, data }) => {
                newStatisticsData[key] = data;
            });

            setStatisticsData(newStatisticsData);
        } catch (err) {
            console.error("Error fetching statistics:", err);
            setError("Failed to load statistics. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [token]);

    if (loading) return <div className="statistics-message">Loading...</div>;
    if (error) return <div className="statistics-message">{error}</div>;

    const renderSection = (key, data) => {
        switch (key) {
            case "userCounts":
                return (
                    <div className="statistics-section" key={key}>
                        <h2>User Counts by Role</h2>
                        <div className="statistics-list">
                            {Object.entries(data).map(([role, count]) => (
                                <div className="statistics-item" key={role}>
                                    <strong>{role}:</strong> {count}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "tourGuideByDepartment":
                return (
                    <div className="statistics-section" key={key}>
                        <h2>Tour Guide Count by Department</h2>
                        <div className="statistics-list">
                            {Object.entries(data).map(([department, count]) => (
                                <div className="statistics-item" key={department}>
                                    <strong>{department}:</strong> {count}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "tourGuideByGrade":
                return (
                    <div className="statistics-section" key={key}>
                        <h2>Tour Guide Count by Grade</h2>
                        <div className="statistics-list">
                            {Object.entries(data).map(([grade, count]) => (
                                <div className="statistics-item" key={grade}>
                                    <strong>Grade {grade}:</strong> {count}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "tourApplicationCountByStatus":
                return (
                    <div className="statistics-section" key={key}>
                        <h2>Tour Applications by Status</h2>
                        <div className="statistics-list">
                            {Object.entries(data).map(([status, count]) => (
                                <div className="statistics-item" key={status}>
                                    <strong>{status}:</strong> {count}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "tourApplicationCountByType":
                return (
                    <div className="statistics-section" key={key}>
                        <h2>Tour Applications by Type</h2>
                        <div className="statistics-list">
                            {Object.entries(data).map(([type, count]) => (
                                <div className="statistics-item" key={type}>
                                    <strong>{type}:</strong> {count}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "tourCountByHighSchool":
                return (
                    <div className="statistics-section" key={key}>
                        <h2>Tour Count by High School</h2>
                        <div className="statistics-list">
                            {Object.entries(data).map(([highSchool, count]) => (
                                <div className="statistics-item" key={highSchool}>
                                    <strong>{highSchool}:</strong> {count}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "highSchoolCountByCity":
                return (
                    <div className="statistics-section" key={key}>
                        <h2>High School Count by City</h2>
                        <div className="statistics-list">
                            {Object.entries(data).map(([city, count]) => (
                                <div className="statistics-item" key={city}>
                                    <strong>{city}:</strong> {count}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "feedbackCountByRating":
                return (
                    <div className="statistics-section" key={key}>
                        <h2>Feedback Count by Rating</h2>
                        <div className="statistics-list">
                            {Object.entries(data).map(([rating, count]) => (
                                <div className="statistics-item" key={rating}>
                                    <strong>Rating {rating}:</strong> {count}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "fairInvitationCountByStatus":
                return (
                    <div className="statistics-section" key={key}>
                        <h2>Fair Invitations by Status</h2>
                        <div className="statistics-list">
                            {Object.entries(data).map(([status, count]) => (
                                <div className="statistics-item" key={status}>
                                    <strong>{status}:</strong> {count}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="statistics-container">
            <div className="statistics-header">Statistics Dashboard</div>
            {Object.entries(statisticsData).map(([key, data]) => renderSection(key, data))}
        </div>
    );
};

export default Statistics;
