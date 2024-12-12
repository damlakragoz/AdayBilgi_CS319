import React from "react";
import "./Notifications.css"; // Import the styles from a CSS file

const notifications = [
    {
        title: "TUR BAŞVURUNUZ HAKKINDA",
        message:
            "16 Nisan 2025 tarihi, 15.30/17.30 saatleri için yapmış olduğunuz tur başvurunuz reddedilmiştir. Bir sonraki başvuru sürecimizde tekrar tur başvurusu oluşturabileceğinizi hatırlatmak isteriz...",
    },
    {
        title: "TUR BAŞVURUNUZ HAKKINDA",
        message:
            "15 Nisan 2025 tarihi, 11.30/15.30 saatleri için yapmış olduğunuz tur başvurunuz reddedilmiştir. Bir sonraki başvuru sürecimizde tekrar tur başvurusu oluşturabileceğinizi hatırlatmak isteriz...",
    },
    {
        title: "FUAR DAVETİNİZ HAKKINDA",
        message:
            "10 Mart 2025 tarihi, 11.30/15.30 saatleri için yollamış olduğunuz fuar davetiniz kabul edilmiştir. Okulumuz görevlileri yaklaşık olarak (5beş) iş günü içerisinde size geri dönüş yaparak gerekli bilgi...",
    },
    {
        title: "FUAR DAVETİNİZ HAKKINDA",
        message:
            "8 Mart 2025 tarihi, 13.30/15.30 saatleri için yollamış olduğunuz fuar davetiniz reddedilmiştir. Fuar Davetiyesi Gönder sayfasından farklı tarihler için davetiye gönderebileceğinizi hatırlatmak isteriz...",
    },
    {
        title: "SİSTEMİMİZE HOŞ GELDİNİZ!",
        message: "...",
    },
];

const Notifications = () => {
    return (
        <div>
            <nav className="navbar">
                <div className="menu">
                    <div>
                        <a href="#">Tur Başvuruları</a>
                        <div className="dropdown">
                            <a href="#">Başvuru Yap</a>
                            <a href="#">Başvurularım</a>
                            <a href="#">Başvurularımı Düzenle</a>
                        </div>
                    </div>
                    <div>
                        <a href="#">University Fairs</a>
                        <div className="dropdown">
                            <a href="#">Fuar Davetiyesi Gönder</a>
                            <a href="#">Davetlerim</a>
                        </div>
                    </div>
                </div>
                <div className="search">
                    <input type="text" placeholder="Sitede ara..." />
                </div>
                <div className="icons">
                    <div>
                        <a href="#">
                            <i className="fas fa-home"></i>
                        </a>
                    </div>
                    <div>
                        <a href="#">
                            <i className="fas fa-bell"></i>
                        </a>
                    </div>
                    <div>
                        <a href="#">
                            Mehmet Ay<br />Rehber Öğretmen
                        </a>
                    </div>
                </div>
            </nav>
            <div className="content">
                <h1>Bildirimlerim</h1>
                {notifications.map((notification, index) => (
                    <div className="notification" key={index}>
                        <div className="icon">
                            <i className="fas fa-bell"></i>
                        </div>
                        <div className="text">
                            <h2>{notification.title}</h2>
                            <p>{notification.message}</p>
                        </div>
                        <div className="buttons">
                            <button>Bildirimin tamamını oku</button>
                            <button>Yok Say</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
