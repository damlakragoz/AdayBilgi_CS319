import React from 'react';
import '../coordinatorPages/OnayBekleyen.css';
import OnayBekleyenTurlar from '../coordinatorPages/OnayBekleyenTurlar';
import OnayBekleyenFuarlar from '../coordinatorPages/OnayBekleyenFuarlar';

const AdvisorOnayBekleyen = () => {

  return (
    <div className="onay-bekleyen-main-container">
      <OnayBekleyenTurlar/>
    </div>
  );
};

export default AdvisorOnayBekleyen;
