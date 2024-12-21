import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Statistics.css";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from "chart.js";

// Register necessary components for Bar and Pie charts
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

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
                const barChartDataUserCounts = {
                    labels: Object.keys(data),
                    datasets: [
                        {
                            label: "Kullanıcı Sayısı",
                            data: Object.values(data),
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                };

                const barChartOptionsUserCounts = {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Roller",
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Kullanıcı Sayısı",
                            },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                            },
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Rollere Göre Kullanıcı Sayısı</h3>
                        <Bar data={barChartDataUserCounts} options={barChartOptionsUserCounts} />
                    </div>
                );

            case "tourGuideByDepartment":
                const barChartDataTourGuideByDepartment = {
                    labels: Object.keys(data),
                    datasets: [
                        {
                            label: "Tur Rehberi Sayısı",
                            data: Object.values(data),
                            backgroundColor: "rgba(255, 159, 64, 0.6)",
                            borderColor: "rgba(255, 159, 64, 1)",
                            borderWidth: 1,
                        },
                    ],
                };

                const barChartOptionsTourGuideByDepartment = {
                    responsive: true,
                    indexAxis: "y",
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Rehber Sayısı",
                            },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Departmanlar",
                            },
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Departmanlara Göre Tur Rehberi Sayısı</h3>
                        <Bar data={barChartDataTourGuideByDepartment} options={barChartOptionsTourGuideByDepartment} />
                    </div>
                );

            case "tourGuideByGrade":
                const pieChartDataTourGuideByGrade = {
                    labels: Object.keys(data),
                    datasets: [
                        {
                            data: Object.values(data),
                            backgroundColor: [
                                "rgba(255, 99, 132, 0.6)",
                                "rgba(54, 162, 235, 0.6)",
                                "rgba(255, 206, 86, 0.6)",
                                "rgba(75, 192, 192, 0.6)",
                                "rgba(153, 102, 255, 0.6)",
                                "rgba(255, 159, 64, 0.6)",
                            ],
                            borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 206, 86, 1)",
                                "rgba(75, 192, 192, 1)",
                                "rgba(153, 102, 255, 1)",
                                "rgba(255, 159, 64, 1)",
                            ],
                            borderWidth: 1,
                        },
                    ],
                };

                const pieChartOptionsTourGuideByGrade = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Sınıflara Göre Tur Rehberi Sayısı</h3>
                        <div className="pie-chart-container">
                        <Pie data={pieChartDataTourGuideByGrade} options={pieChartOptionsTourGuideByGrade} />
                        </div>
                    </div>
                );

            case "tourApplicationCountByStatus":
                const pieChartDataTourApplicationByStatus = {
                    labels: Object.keys(data),
                    datasets: [
                        {
                            data: Object.values(data),
                            backgroundColor: [
                                "rgba(255, 99, 132, 0.6)",
                                "rgba(54, 162, 235, 0.6)",
                                "rgba(255, 206, 86, 0.6)",
                                "rgba(75, 192, 192, 0.6)",
                            ],
                            borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 206, 86, 1)",
                                "rgba(75, 192, 192, 1)",
                            ],
                            borderWidth: 1,
                        },
                    ],
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Durumlara Göre Tur Başvuru Sayısı</h3>
                        <div className="pie-chart-container">
                            <Pie data={pieChartDataTourApplicationByStatus} />
                        </div>
                    </div>
                );

            case "tourApplicationCountByType":
                const pieChartDataTourApplicationByType = {
                    labels: Object.keys(data),
                    datasets: [
                        {
                            data: Object.values(data),
                            backgroundColor: [
                                "rgba(75, 192, 192, 0.6)",
                                "rgba(153, 102, 255, 0.6)",
                            ],
                            borderColor: [
                                "rgba(75, 192, 192, 1)",
                                "rgba(153, 102, 255, 1)",
                            ],
                            borderWidth: 1,
                        },
                    ],
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Başvuru Türüne Göre Tur Sayısı</h3>
                        <div className="pie-chart-container">
                            <Pie data={pieChartDataTourApplicationByType} />
                        </div>
                    </div>
                );

            case "tourCountByHighSchool":
                const barChartDataTourCountByHighSchool = {
                    labels: Object.keys(data), // High Schools
                    datasets: [
                        {
                            label: "Tur Sayısı",
                            data: Object.values(data), // Counts
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                };

                const barChartOptionsTourCountByHighSchool = {
                    responsive: true,
                    indexAxis: "y", // Horizontal bars
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Tur Sayısı",
                            },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1, // Ensure integer steps
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Okullar",
                            },
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Okullara Göre Tur Sayısı</h3>
                        <Bar data={barChartDataTourCountByHighSchool} options={barChartOptionsTourCountByHighSchool} />
                    </div>
                );

            case "highSchoolCountByCity":
                const barChartDataHighSchoolByCity = {
                    labels: Object.keys(data), // Cities
                    datasets: [
                        {
                            label: "Lise Sayısı",
                            data: Object.values(data), // Counts
                            backgroundColor: "rgba(153, 102, 255, 0.6)",
                            borderColor: "rgba(153, 102, 255, 1)",
                            borderWidth: 1,
                        },
                    ],
                };

                const barChartOptionsHighSchoolByCity = {
                    responsive: true,
                    indexAxis: "y", // Horizontal bars
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Lise Sayısı",
                            },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1, // Ensure integer steps
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Şehirler",
                            },
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Şehirlere Göre Lise Sayısı</h3>
                        <Bar data={barChartDataHighSchoolByCity} options={barChartOptionsHighSchoolByCity} />
                    </div>
                );

            case "feedbackCountByRating":
                const barChartDataFeedbackByRating = {
                    labels: Object.keys(data),
                    datasets: [
                        {
                            label: "Geri Bildirim Sayısı",
                            data: Object.values(data),
                            backgroundColor: "rgba(255, 99, 132, 0.6)",
                            borderColor: "rgba(255, 99, 132, 1)",
                            borderWidth: 1,
                        },
                    ],
                };

                const barChartOptionsFeedbackCounts = {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Puan",
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Geri Bildirim Sayısı",
                            },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                            },
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Puanlara Göre Geri Bildirim Sayısı</h3>
                        <Bar data={barChartDataFeedbackByRating} options={barChartOptionsFeedbackCounts} />
                    </div>
                );

            case "fairInvitationCountByStatus":
                const pieChartDataFairInvitationByStatus = {
                    labels: Object.keys(data),
                    datasets: [
                        {
                            data: Object.values(data),
                            backgroundColor: [
                                "rgba(255, 99, 132, 0.6)",
                                "rgba(54, 162, 235, 0.6)",
                                "rgba(75, 192, 192, 0.6)",
                            ],
                            borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(75, 192, 192, 1)",
                            ],
                            borderWidth: 1,
                        },
                    ],
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Durumlara Göre Fuar Davetiye Sayısı</h3>
                        <div className="pie-chart-container">
                            <Pie data={pieChartDataFairInvitationByStatus} />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };


    return (
        <div className="statistics-container">
            <div className="statistics-header">İstatistikler</div>
            {Object.entries(statisticsData).map(([key, data]) => renderSection(key, data))}
        </div>
    );
};

export default Statistics;
