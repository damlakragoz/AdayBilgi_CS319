# AdayBilgi Website 



https://github.com/user-attachments/assets/8c53b029-c632-4f5d-8491-a138ce170acf




**AdayBilgi** is a web application that is an existing website of **Bilkent Tanitim Ofisi (BTO)**, being redeveloped in the scope of **CS319 - Fall 2024**. This website offers prospective students a variety of resources and information to assist in their decision-making process when choosing Bilkent University. Throughout the year, AdayBilgi provides a range of services, including:
- **Campus Visits**
- **Career Seminars** (during the university selection period)
- **Virtual Campus Tours**
- **Promotional Booklets**
- **Promotional Videos**

**Some of the main existing features of the app are:**
- School counselors can submit their applications for campus tours by specifying the school information, counselor information, and requested tour dates and times.
- The website offers information about current ÖSYS statistics, undergraduate programs, school fees and scholarships, dormitory facilities, alumni whereabouts, and FAQ.
- A virtual campus tour is provided.

## Objectives of Our Project: Enhancing the Site
The updated version of AdayBilgi aims to optimize these services by introducing new features, such as providing specialized user interfaces tailored to different user groups and automating the process of high school campus visit scheduling.

## Key Improvements
- We aim to provide specialized user interfaces for different user groups (actors), such as BTO members, high school counselors, and prospective students.
  - Actors of the app are Counselors, BTO members, tour guides, students 
  - _Counselors_ will be able to open an account and apply to the campus tours via the system. After the application, they will get notified about the tours and once the process is completed, they will get asked about their feedback.
  - _BTO members_ will be able to view the visit requests and time slots assigned by the system.
  - _Tour guides_ will be able to see the visiting high schools and choose the tours they want to guide using the website. Also, they can see the corresponding fee they will get from that month’s tours regarding the time they spent.
  - _Students_ and _parents_ will be able to individually apply to the system without opening an account.

- The process of scheduling high school campus visits is currently handled manually. We will add an algorithm to replace the current manual process, automatically assigning visit time slots to high schools. The algorithm will also prioritize certain high schools according to some conditions such as their locations, YKS successes, and number of alumni they sent to Bilkent. This will help prioritize high schools that are more likely to result in prospective students, providing a more efficient and tailored service to high schools on behalf of the BTO.
- The application form will be enhanced to allow counselors to select multiple time slots. We might also show the visit schedules to counselors so that they see if a certain day is very crowded.
- Counselors who join a tour can send feedback about their experience via the website. The feedback format will be similar to the Google Maps review format.
- Useful data will be extracted from websites such as YÖKATLAS and ÖSYM with the help of web scraping or using their API service if available. This data will be essential for implementing scheduling algorithms and having adequate information about actors (students, counselors, schools etc.) who will be using the application.
- A new dashboard will be provided for coordinator, displaying data such as the number of students sent by each school, their scholarship statuses, their departments, and other relevant statistics.
- The UI and UX of the website will be simpler and more engaging.

## Tentative Technology Stack
- SpringBoot, React, MySql.

## Actors
- High school students
- High school counselors
- Information Office:
  - Coordinators
  - Guides
  - Advisors
  - Executives
  - Bilkent Professors

## Team Members
- İrem Damla Karagöz - 22203691
- Hatice Kübra Çağlar - 21803456
- Yiğit Özhan - 22201973
- İbrahim Çaycı - 22103515
- Eray İşçi - 22201686
- Emine Noor - 22201252
