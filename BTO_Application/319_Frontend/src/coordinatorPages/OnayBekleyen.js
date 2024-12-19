import React from 'react';
import './OnayBekleyen.css';
import OnayBekleyenTurlar from './OnayBekleyenTurlar';
import OnayBekleyenFuarlar from './OnayBekleyenFuarlar';

const OnayBekleyen = () => {

  return (
    <div className="onay-bekleyen-container">
      <h3 className="onay-bekleyen-header">Onay Bekleyen Işlemler</h3>
      <OnayBekleyenTurlar/>
      <OnayBekleyenFuarlar/>
    </div>
  );
};

export default OnayBekleyen;
