import React from "react";
import Section from "./Section";

const CounselorDashboardContent = () => {
    const applications = [
        { status: "Onaylandı", date: "25.08.2024", time: "15.30-16.30", action: "Turu iptal et" },
        { status: "Onay bekleniyor", date: "24.08.2024", time: "11.30-12.30" },
        { status: "Reddedildi", date: "21.07.2024", time: "10.30-11.30" },
    ];

    const feedbacks = [
        { status: "Geri dönüt bekleniyor.", activity: "Tur", date: "25.08.2023", time: "11.30-12.30", stars: 0 },
        { status: "Geri dönüt verildi.", activity: "Fuar", date: "20.07.2022", time: "15.30-16.30", stars: 3 },
    ];

    const invitations = [
        { status: "Onay bekleniyor", date: "25.08.2024", time: "13.30-17.30" },
    ];

    return (
        <div className="p-4">
            <Section title="Tur Başvurularım" data={applications} type="applications" editAction="Başvuruları Düzenle" />
            <Section title="Geri Bildirimlerim" data={feedbacks} type="feedbacks" editAction="Geri Bildirimleri Düzenle" />
            <Section title="Üniversite Fuarı Davetlerim" data={invitations} type="invitations" editAction="Davetleri Düzenle" />
        </div>
    );
};

export default CounselorDashboardContent;
