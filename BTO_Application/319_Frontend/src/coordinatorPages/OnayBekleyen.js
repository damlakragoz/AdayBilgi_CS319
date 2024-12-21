import React from 'react';
import './OnayBekleyen.css';
import OnayBekleyenTurlar from './OnayBekleyenTurlar';
import OnayBekleyenFuarlar from './OnayBekleyenFuarlar';

const OnayBekleyen = () => {

  return (
    <div className="onay-bekleyen-main-container">
      <h1 className="onay-bekleyen-header-main">Onay Bekleyen İşlemler</h1>
      <OnayBekleyenTurlar/>
      <OnayBekleyenFuarlar/>
    </div>
  );
};

export default OnayBekleyen;
