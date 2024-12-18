import React from 'react';
import './NavbarMainPage.css';

const NavbarMainPage = () => {
    return (
        <nav className="navbar-unique">
            <ul className="navbar-links-unique">
                <li><a href="#osys">ÖSYS Bilgileri</a></li>
                <li><a href="#programlar">Eğitim Programları</a></li>
                <li><a href="#ucretler">Ücretler - Burslar</a></li>
                <li><a href="#akademik">Akademik Bilgiler</a></li>
                <li><a href="#kampus">Kampüste Yaşam</a></li>
                <li><a href="#mezunlar">Mezunlar</a></li>
                <li><a href="#sorular">Sorular</a></li>
            </ul>
        </nav>
    );
};

export default NavbarMainPage;
