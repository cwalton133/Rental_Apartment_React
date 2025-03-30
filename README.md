# AirNest-Real-Estate

## Overview

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

```bash
git clone https://github.com/cwalton133/airnest_real_estate.git
cd AirNest-Realty


python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows


pip install -r backend/requirements.txt

4️⃣ Run database migrations
bash
python manage.py migrate

5️⃣ Create a superuser
bash
python manage.py createsuperuser

Run the Django server
python manage.py runserver

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
ALLOWED_HOSTS=*
DATABASE_URL=your_postgres_db_url

Frontend (frontend/.env)
ini
VITE_API_BASE_URL=http://127.0.0.1:8000/api

Project Structure

/AirNest-Realty/
│── backend/
│   ├── config/                # Main project settings & URLs
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   ├── users/                 # User authentication & profiles
│   │   ├── models.py (User - AbstractUser)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   ├── realtors/              # Realtor-specific logic
│   │   ├── models.py (Realtor)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   ├── listings/              # Property-related models
│   │   ├── models.py (Property, PropertyImage, Amenity, PropertyAmenity)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   ├── bookings/              # Booking & payments
│   │   ├── models.py (Booking, Payment)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   ├── reviews/               # User reviews & ratings
│   │   ├── models.py (Review)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   ├── wishlist/              # User wishlist management
│   │   ├── models.py (Wishlist, WishlistProperty)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py



## All API Endpoints


1️⃣ Authentication (Users App)
Method	Endpoint	Description
POST	/api/auth/register/	Register a new user
POST	/api/auth/login/	Log in and receive a token
POST	/api/auth/logout/	Log out user
GET	/api/auth/user/	Get logged-in user details
PUT	/api/auth/user/update/	Update user profile
POST	/api/auth/password-reset/	Send password reset email
POST	/api/auth/password-reset-confirm/	Confirm password reset


2️⃣ Listings (Property Listings App)
Method	Endpoint	Description
GET	/api/listings/	Get all listings
POST	/api/listings/create/	Create a new property listing
GET	/api/listings/{id}/	Get a single listing by ID
PUT	/api/listings/{id}/update/	Update a listing
DELETE	/api/listings/{id}/delete/	Delete a listing
GET	/api/listings/search/?q=keyword	Search listings
POST	/api/listings/{id}/favorite/	Add a listing to favorites


3️⃣ Bookings (Reservation System)
Method	Endpoint	Description
GET	/api/bookings/	Get all bookings for the user
POST	/api/bookings/create/	Create a new booking
GET	/api/bookings/{id}/	Get booking details
PUT	/api/bookings/{id}/update/	Update a booking
DELETE	/api/bookings/{id}/cancel/	Cancel a booking


4️⃣ Payments (Payment Processing)
Method	Endpoint	Description
GET	/api/payments/	Get payment history
POST	/api/payments/create/	Make a payment for a booking
GET	/api/payments/{id}/	Get payment details
POST	/api/payments/verify/	Verify a payment transaction


5️⃣ Reviews & Ratings
Method	Endpoint	Description
GET	/api/reviews/	Get all reviews
POST	/api/reviews/create/	Create a new review
GET	/api/reviews/{id}/	Get a review by ID
PUT	/api/reviews/{id}/update/	Update a review
DELETE	/api/reviews/{id}/delete/	Delete a review

6️⃣ Miscellaneous
Method	Endpoint	Description
GET	/api/countries/	Get a list of supported countries
GET	/api/cities/?country=US	Get cities by country
GET	/api/stats/	Get system statistics (total users, listings, bookings, etc.)
How to Test the API?
Postman – Import these endpoints and test requests.
cURL – Use command-line requests like:


curl -X GET http://127.0.0.1:8000/api/listings/
Frontend (React TypeScript) – Use fetch or axios to call APIs.

fetch('/api/listings/')



License
This project is licensed under the MIT License.

Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Fork the repository.
Create a feature branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/YourFeature).
Open a pull request.

Contact Us
For any questions or feedback, please contact:

Charles Walton - cwalton1335@gmail.com
GitHub: cwalton133
OluwaSegun Bankole -bankoleoluwasegun17@yahoo.com
GithHub:

Thank you for checking out the AirNest-Realtor Application!
```
