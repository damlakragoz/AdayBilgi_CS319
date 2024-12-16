import React from 'react';
import './ContentSection.css';

const ContentSection = () => {
    return (
        <section className="content-section">
            <div className="content-card">
                <h3>Kampüsü Keşfedin</h3>
                <p>Kampüsümüzün güzelliklerini ve olanaklarını rehberli turlarımızla keşfedin.</p>
            </div>
            <div className="content-card">
                <h3>Üniversite Fuarları</h3>
                <p>Okulumuzu lisenizin üniversite fuarına davet ederek öğrencilerinize geleceğin fırsatları ile tanıtın.</p>
            </div>
            <div className="content-card">
                <h3>Akademik Mükemmellik</h3>
                <p>Bilkentteki eğitim programlarını keşfedin!</p>
            </div>
        </section>
    );
};

export default ContentSection;
