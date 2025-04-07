<p align="left">
  <a href="https://www.linkedin.com/in/cwalton1335" target="_blank"><img alt="LinkedIn" title="LinkedIn" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a><a href="https://www.youtube.com/channel/#" target="_blank"><img alt="YouTube" title="YouTube" src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white"/></a><a href="https://www.buymeacoffee.com/cwalton1335" target="_blank"><img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee"></a><a href="https://www.udemy.com/course/#" target="_blank"><img src="https://img.shields.io/badge/Udemy-EC5252?style=for-the-badge&logo=Udemy&logoColor=white" alt="Udemy"></a>

</p>

# AirNest-Real-Estate

# Overview

**AirNest-Realty** is a modern real estate platform that enables realtors to list, manage, and analyze
Airbnb-style rental properties.
Built with **Django (DRF) for the backend** and **React TypeScript with Vite for the frontend**,
it ensures high performance, scalability, and a smooth user experience.

## Tech Stack

- **Backend:** Django REST Framework (DRF), PostgreSQL
- **Frontend:** React.js + TypeScript + Vite, Tailwind CSS
- **Authentication:** JWT (Django Simple JWT)
- **Deployment:** Docker, AWS (EC2, S3), Vercel (Frontend)
- **CI/CD:** GitHub Actions

---

## Features

- 🏡 **Property Listings** – Add, edit, and manage rental properties.
- 🔐 **Authentication** – User sign-up, login, and role-based access.
- 📊 **Analytics Dashboard** – Track performance of listed properties.
- 📍 **Google Maps Integration** – View locations of properties.
- 📅 **Booking System** – API to integrate booking features.

---

## Project Setup

### **Backend (Django API)**

#### 1️⃣ Clone the repository

## Models

The application defines two primary models: `Property` and `Booking`.

### Author Model

Represents an author in the system.

#### Fields

- **id**: UUIDField (Primary Key) - Unique identifier for each author, automatically generated.
- **firstname**: CharField - Author's first name (max length: 55).
- **lastname**: CharField - Author's last name (max length: 55).
- **image**: ImageField - Upload field for author images.
- **othername**: CharField - Author's other name (optional).
- **email**: EmailField - Author's email address.
- **phone_number_1**: CharField - Primary phone number (max length: 20).
- **phone_number_2**: CharField - Secondary phone number (optional, max length: 20).
- **created_at**: DateTimeField - Timestamp when the author record was created.

#### Meta

- Orders authors by `created_at`, latest first.

#### String Representation

Returns the author's first name when the object is represented as a string.

### Course Model

Represents a course related to an author.

#### Fields

- **id**: UUIDField (Primary Key) - Unique identifier for each course, automatically generated.
- **name**: CharField - Name of the course (max length: 150).
- **description**: TextField - Detailed description of the course.
- **author**: ForeignKey - Link to the `Author` model, establishes a relationship.
- **created_at**: DateTimeField - Timestamp when the course record was created.

<p align="left">
  <a href="https://www.udemy.com/course/#" target="_blank"><img src="https://img.shields.io/badge/Udemy-5624D0?style=for-the-badge&logo=Udemy&logoColor=white" alt="Udemy"></a>
</p>
<p align="left">
<img src="https://github.com/cwalton133/Rental_Apartment_React/blob/master/Screenshot 2025-04-01 224950.png">

<img src="https://github.com/cwalton133/Rental_Apartment_React/blob/master/Screenshot 2025-04-02 081023.png">

<img src="https://github.com/cwalton133/Rental_Apartment_React/blob/master/Screenshot 2025-04-02 081402.png">

<img src="https://github.com/cwalton133/Rental_Apartment_React/blob/master/Screenshot 2025-04-02 081615.png">

<img src="https://github.com/cwalton133/Rental_Apartment_React/blob/master/Screenshot 2025-04-02 081630.png">

<img src="https://github.com/cwalton133/Rental_Apartment_React/blob/master/Screenshot 2025-04-02 081849.png">

<img src="https://github.com/cwalton133/Rental_Apartment_React/blob/master/Screenshot 2025-04-02 082044.png">

<img src="https://github.com/cwalton133/Rental_Apartment_React/blob/master/Screenshot 2025-04-02 082229.png">

<img src="https://github.com/cwalton133/Rental_Apartment_React/blob/master/Screenshot 2025-04-05 171330.png">

</p>

# Setup Instructions

Follow these steps to set up the project locally:

1. Clone the repository `git clone [https://github.com/cwalton133/airnest_real_estate.git/]
2. Navigrate to the working directory `cd Rental_Apartment_React`
3. Open the project from the code editor `code .` or `atom .`
4. Create virtual environment `python -m venv env`
5. Activate the virtual environment `source env/Scripts/activate`
6. Install required packages to run the project `pip install -r requirements.txt`
7. Rename _.env-sample_ to _.env_
8. Fill up the environment variables:
   _Generate your own Secret key using this tool [https://djecrety.ir/](https://djecrety.ir/), copy and paste the secret key in the SECRET_KEY field._

   _Your configuration should look something like this:_

   ```sh
   SECRET_KEY=47d)n05#ei0rg4#)*@fuhc%$5+0n(t%jgxg$)!1pkegsi*l4c%
   DEBUG=True
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_HOST_USER=youremailaddress@gmail.com
   EMAIL_HOST_PASSWORD=yourStrongPassword
   EMAIL_USE_TLS=True
   ```

   _Note: If you are using gmail account, make sure to [use app password](https://support.google.com/accounts/answer/185833)_

9. Create database tables
   ```sh
   python manage.py migrate
   ```
10. Create a super user
    ```sh
    python manage.py createsuperuser
    ```
    _GitBash users may have to run this to create a super user - `winpty python manage.py createsuperuser`_
11. Run server
    ```sh
    python manage.py runserver
    ```
12. Login to admin panel - (`http://127.0.0.1:8000/admin/`)
13. Add Author, Course, add Book, register user, login, and EXPLORE SO MANY FEATURES

Frontend (React + Vite)
1️⃣ Navigate to the frontend folder
bash
cd frontend

Install dependencies
npm install

tart the development server
npm run dev

Environment Variables
Create a .env file in both backend/ and frontend/ with the following:

Backend (backend/.env)
ini

SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=\*
DATABASE_URL=your_postgres_db_url

Frontend (frontend/.env)
ini
VITE_API_BASE_URL=http://127.0.0.1:8000/api

Project Structure

/AirNest-Realty/
│── backend/
│ ├── config/ # Main project settings & URLs
│ │ ├── settings.py
│ │ ├── urls.py
│ │ ├── wsgi.py
│ │ ├── asgi.py
│ ├── users/ # User authentication & profiles
│ │ ├── models.py (User - AbstractUser)
│ │ ├── views.py
│ │ ├── serializers.py
│ │ ├── urls.py
│ ├── realtors/ # Realtor-specific logic
│ │ ├── models.py (Realtor)
│ │ ├── views.py
│ │ ├── serializers.py
│ │ ├── urls.py
│ ├── listings/ # Property-related models
│ │ ├── models.py (Property, PropertyImage, Amenity, PropertyAmenity)
│ │ ├── views.py
│ │ ├── serializers.py
│ │ ├── urls.py
│ ├── bookings/ # Booking & payments
│ │ ├── models.py (Booking, Payment)
│ │ ├── views.py
│ │ ├── serializers.py
│ │ ├── urls.py
│ ├── reviews/ # User reviews & ratings
│ │ ├── models.py (Review)
│ │ ├── views.py
│ │ ├── serializers.py
│ │ ├── urls.py
│ ├── wishlist/ # User wishlist management
│ │ ├── models.py (Wishlist, WishlistProperty)
│ │ ├── views.py
│ │ ├── serializers.py
│ │ ├── urls.py

## Support

💙 If you like this project, give it a ⭐ and share it with friends!

<p align="left">
Endpoints (Example)

1️⃣ Authentication (Users App)
Method Endpoint Description
POST /api/auth/register/ Register a new user
POST /api/auth/login/ Log in and receive a token
POST /api/auth/logout/ Log out user
GET /api/auth/user/ Get logged-in user details
PUT /api/auth/user/update/ Update user profile
POST /api/auth/password-reset/ Send password reset email
POST /api/auth/password-reset-confirm/ Confirm password reset

2️⃣ Listings (Property Listings App)
Method Endpoint Description
GET /api/listings/ Get all listings
POST /api/listings/create/ Create a new property listing
GET /api/listings/{id}/ Get a single listing by ID
PUT /api/listings/{id}/update/ Update a listing
DELETE /api/listings/{id}/delete/ Delete a listing
GET /api/listings/search/?q=keyword Search listings
POST /api/listings/{id}/favorite/ Add a listing to favorites

3️⃣ Bookings (Reservation System)
Method Endpoint Description
GET /api/bookings/ Get all bookings for the user
POST /api/bookings/create/ Create a new booking
GET /api/bookings/{id}/ Get booking details
PUT /api/bookings/{id}/update/ Update a booking
DELETE /api/bookings/{id}/cancel/ Cancel a booking

4️⃣ Payments (Payment Processing)
Method Endpoint Description
GET /api/payments/ Get payment history
POST /api/payments/create/ Make a payment for a booking
GET /api/payments/{id}/ Get payment details
POST /api/payments/verify/ Verify a payment transaction

5️⃣ Reviews & Ratings
Method Endpoint Description
GET /api/reviews/ Get all reviews
POST /api/reviews/create/ Create a new review
GET /api/reviews/{id}/ Get a review by ID
PUT /api/reviews/{id}/update/ Update a review
DELETE /api/reviews/{id}/delete/ Delete a review

6️⃣ Miscellaneous
Method Endpoint Description
GET /api/countries/ Get a list of supported countries
GET /api/cities/?country=US Get cities by country
GET /api/stats/ Get system statistics (total users, listings, bookings, etc.)
How to Test the API?
Postman – Import these endpoints and test requests.
cURL – Use command-line requests like:.

curl -X GET http://127.0.0.1:8000/api/listings/
Frontend (React TypeScript) – Use fetch or axios to call APIs.

fetch('/api/listings/')

License
This project is licensed under the MIT License.
License This project is licensed under the MIT License. MIT License Copyright (c) 2025

Acknowledgements Django Django REST Framework JSON Web Tokens

</p>

<p align="left">

## Contributing

Contributing Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Fork the repository. Create a feature branch (git checkout -b feature/YourFeature). Commit your changes (git commit -m 'Add some feature'). Push to the branch (git push origin feature/YourFeature). Open a pull request.

</p>

## Contact Me

Contact me for any questions or feedback, please contact:

[Check me out on my Githhub](https://github.com/cwalton133/)

<p align="left">Charles Walton</p>

<p align="left">
  <a href="https://www.linkedin.com/in/cwalton1335"><img alt="LinkedIn" title="LinkedIn" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a><a href="mailto:cwalton1335@gmail.com"><img alt="Gmail" title="Gmail" src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"/></a>
</p>
##
Made with ❤️ and Django-Python
