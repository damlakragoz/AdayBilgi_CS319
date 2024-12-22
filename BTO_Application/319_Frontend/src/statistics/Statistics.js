import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Statistics.css";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";

// Register necessary components for Bar and Pie charts
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Statistics = () => {
    const [statisticsData, setStatisticsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("BTO Üyeleri"); // Define selectedCategory state

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
        tourCountByMonth: "tourCountByMonth",
        fairCountByMonth: "fairCountByMonth",
        paymentAmountByMonth: "paymentAmountByMonth",
    };

    const statusTranslations = {
        Created: "Oluşturuldu",
        Pending: "Onay Bekliyor",
        Approved: "Onaylandı",
        "Pre-rejected": "Önceden Reddedildi",
        Rejected: "Reddedildi",
        Cancelled: "İptal Edildi",
        Finished: "Tamamlandı",
    };

    const categories = {
        "BTO Üyeleri": [
            "userCounts",
            "tourGuideByDepartment",
            "tourGuideByGrade"
        ],
        "Turlar": [
            "tourApplicationCountByStatus",
            "tourApplicationCountByType",
            "tourCountByHighSchool",
            "tourCountByMonth",
        ],
        "Fuarlar": [
            "fairInvitationCountByStatus",
            "fairCountByMonth"
        ],
        "Diğerleri": [
            "feedbackCountByRating",
            "paymentAmountByMonth",
            "highSchoolCountByCity"
        ],
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
                            onClick: null, // Disable all interactivity
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
                            onClick: null, // Disable all interactivity
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
                            onClick: null, // Disable all interactivity
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
                const translatedLabels = Object.keys(data).map(
                    (key) => statusTranslations[key] || key // Translate or keep original
                );

                const pieChartDataTourApplicationByStatus = {
                    labels: translatedLabels,
                    datasets: [
                        {
                            data: Object.values(data),
                            backgroundColor: [
                                "rgba(173, 216, 230, 0.6)", // Light Blue
                                "rgba(144, 238, 144, 0.6)", // Light Green
                                "rgba(240, 128, 128, 0.6)", // Light Coral
                                "rgba(255, 218, 185, 0.6)", // Peach Puff
                                "rgba(221, 160, 221, 0.6)", // Plum
                                "rgba(255, 250, 205, 0.6)", // Lemon Chiffon
                                "rgba(175, 238, 238, 0.6)", // Pale Turquoise
                                "rgba(240, 230, 140, 0.6)", // Khaki
                                "rgba(230, 230, 250, 0.6)", // Lavender
                                "rgba(245, 222, 179, 0.6)", // Wheat
                            ],
                            borderColor: [
                                "rgba(135, 206, 250, 1)",   // Sky Blue
                                "rgba(60, 179, 113, 1)",   // Medium Sea Green
                                "rgba(205, 92, 92, 1)",    // Indian Red
                                "rgba(244, 164, 96, 1)",   // Sandy Brown
                                "rgba(186, 85, 211, 1)",   // Medium Orchid
                                "rgba(255, 240, 130, 1)",  // Light Goldenrod
                                "rgba(32, 178, 170, 1)",   // Light Sea Green
                                "rgba(218, 165, 32, 1)",   // Goldenrod
                                "rgba(186, 188, 241, 1)",  // Light Lavender
                                "rgba(222, 184, 135, 1)",  // Burly Wood
                            ],
                            borderWidth: 1,
                        },
                    ],
                };

                const pieChartOptionsTourApplicationByStatus = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                            onClick: null, // Disable all interactivity
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Durumlara Göre Tur Başvuru Sayısı</h3>
                        <div className="pie-chart-container">
                            <Pie data={pieChartDataTourApplicationByStatus} options={pieChartOptionsTourApplicationByStatus} />
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

                const pieChartOptionsTourApplicationByType = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                            onClick: null, // Disable all interactivity
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Başvuru Türüne Göre Tur Sayısı</h3>
                        <div className="pie-chart-container">
                            <Pie data={pieChartDataTourApplicationByType} options={pieChartOptionsTourApplicationByType} />
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
                            onClick: null, // Disable all interactivity
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
                            onClick: null, // Disable all interactivity
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
                            onClick: null, // Disable all interactivity
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
                const translatedLabelsFair = Object.keys(data).map(
                    (key) => statusTranslations[key] || key
                );

                const pieChartDataFairInvitationByStatus = {
                    labels: translatedLabelsFair,
                    datasets: [
                        {
                            data: Object.values(data),
                            backgroundColor: [
                                "rgba(173, 216, 230, 0.6)", // Light Blue
                                "rgba(144, 238, 144, 0.6)", // Light Green
                                "rgba(240, 128, 128, 0.6)", // Light Coral
                                "rgba(255, 218, 185, 0.6)", // Peach Puff
                                "rgba(221, 160, 221, 0.6)", // Plum
                                "rgba(255, 250, 205, 0.6)", // Lemon Chiffon
                                "rgba(175, 238, 238, 0.6)", // Pale Turquoise
                                "rgba(240, 230, 140, 0.6)", // Khaki
                                "rgba(230, 230, 250, 0.6)", // Lavender
                                "rgba(245, 222, 179, 0.6)", // Wheat
                            ],
                            borderColor: [
                                "rgba(135, 206, 250, 1)",   // Sky Blue
                                "rgba(60, 179, 113, 1)",   // Medium Sea Green
                                "rgba(205, 92, 92, 1)",    // Indian Red
                                "rgba(244, 164, 96, 1)",   // Sandy Brown
                                "rgba(186, 85, 211, 1)",   // Medium Orchid
                                "rgba(255, 240, 130, 1)",  // Light Goldenrod
                                "rgba(32, 178, 170, 1)",   // Light Sea Green
                                "rgba(218, 165, 32, 1)",   // Goldenrod
                                "rgba(186, 188, 241, 1)",  // Light Lavender
                                "rgba(222, 184, 135, 1)",  // Burly Wood
                            ],
                            borderWidth: 1,
                        },
                    ],
                };

                const pieChartOptionsFairInvitationByStatus = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                            onClick: null, // Disable all interactivity
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Durumlara Göre Fuar Davetiye Sayısı</h3>
                        <div className="pie-chart-container">
                            <Pie data={pieChartDataFairInvitationByStatus} options={pieChartOptionsFairInvitationByStatus} />
                        </div>
                    </div>
                );

            case "tourCountByMonth":
                const lineChartDataTourCountByMonth = {
                    labels: Object.keys(data), // Month names as labels
                    datasets: [
                        {
                            label: "Aylara Göre Tur Sayısı",
                            data: Object.values(data), // Tour counts as data
                            fill: false,
                            borderColor: "rgba(75, 192, 192, 1)", // Line color
                            backgroundColor: "rgba(75, 192, 192, 0.6)", // Point background color
                            tension: 0.2, // Line smoothness
                        },
                    ],
                };

                const lineChartOptionsTourCountByMonth = {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                            onClick: null, // Disable all interactivity
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `Tur Sayısı: ${tooltipItem.raw}`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Aylar",
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Tur Sayısı",
                            },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1, // Ensure integer steps
                            },
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Aylara Göre Tur Sayısı</h3>
                        <Line data={lineChartDataTourCountByMonth} options={lineChartOptionsTourCountByMonth} />
                    </div>
                );

            case "fairCountByMonth":
                const lineChartDataFairCountByMonth = {
                    labels: Object.keys(data), // Month names as labels
                    datasets: [
                        {
                            label: "Aylara Göre Fuar Sayısı",
                            data: Object.values(data), // Fair counts as data
                            fill: false,
                            borderColor: "rgba(255, 99, 132, 1)", // Line color
                            backgroundColor: "rgba(255, 99, 132, 0.6)", // Point background color
                            tension: 0.2, // Line smoothness
                        },
                    ],
                };

                const lineChartOptionsFairCountByMonth = {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                            onClick: null, // Disable all interactivity
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `Fuar Sayısı: ${tooltipItem.raw}`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Aylar",
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Fuar Sayısı",
                            },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1, // Ensure integer steps
                            },
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Aylara Göre Fuar Sayısı</h3>
                        <Line data={lineChartDataFairCountByMonth} options={lineChartOptionsFairCountByMonth} />
                    </div>
                );

            case "paymentAmountByMonth":
                const lineChartDataPaymentAmountByMonth = {
                    labels: Object.keys(data), // Month names as labels
                    datasets: [
                        {
                            label: "Aylara Göre Ödeme Miktarı (₺)",
                            data: Object.values(data), // Payment amounts as data
                            fill: false,
                            borderColor: "rgba(54, 162, 235, 1)", // Line color
                            backgroundColor: "rgba(54, 162, 235, 0.6)", // Point background color
                            tension: 0.2, // Line smoothness
                        },
                    ],
                };

                const lineChartOptionsPaymentAmountByMonth = {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                            onClick: null, // Disable all interactivity
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `Toplam Ödeme: ₺${tooltipItem.raw}`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Aylar",
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Toplam Ödeme Miktarı (₺)",
                            },
                            beginAtZero: true,
                        },
                    },
                };

                return (
                    <div className="statistics-section" key={key}>
                        <h3>Aylara Göre Ödeme Miktarı</h3>
                        <Line data={lineChartDataPaymentAmountByMonth} options={lineChartOptionsPaymentAmountByMonth} />
                    </div>
                );

            default:
                return null;
        }
    };

    const renderButtons = () => (
        <div className="category-buttons">
            {Object.keys(categories).map((category) => (
                <button
                    key={category}
                    className={`category-button ${selectedCategory === category ? "active" : ""}`}
                    onClick={() => setSelectedCategory(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );


    return (
        <div className="statistics-container">
            <div className="statistics-header">İstatistikler</div>
            {renderButtons()}
            <div className="statistics-sections">
                {Object.entries(statisticsData)
                    .filter(([key]) => categories[selectedCategory].includes(key))
                    .map(([key, data]) => renderSection(key, data))}
            </div>
        </div>
    );
};

export default Statistics;
