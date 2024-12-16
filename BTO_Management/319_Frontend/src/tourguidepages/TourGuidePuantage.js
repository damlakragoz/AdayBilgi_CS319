import React from 'react';
import TourGuideNavbar from './TourGuideNavbar';

const TourGuidePuantage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        }).format(date);
    };
    return (

        <div className="tourguide-puantage">
        {/* Calendar Section */}
                      <div className="calendar-container">
                        <Calendar
                          onChange={handleDateChange}
                          value={selectedDate}
                          locale="tr-TR"
                        />
                      </div>
            <TourGuideNavbar />
            <h1>Welcome to the Tour Guide Puantage</h1>
            <p>This is an empty page for now.</p>
        </div>

    );
};

export default TourGuidePuantage;