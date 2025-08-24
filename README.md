

# Secrets Web App

![Node.js](https://img.shields.io/badge/Node.js-v22.16.0-green) ![Express](https://img.shields.io/badge/Express-4.x-lightgrey) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue) 

A secure web application to register, login, and manage secrets. Built with **Node.js, Express, and MongoDB Atlas** with JWT-based authentication.  

---

## **Live Demo**



---

## **Features**

- ✅ User registration (name, email, password)  
- ✅ Email & password validation  
- ✅ Password hashing using **bcrypt**  
- ✅ Show/Hide password option  
- ✅ Login with **JWT token**  
- ✅ Session management with **HttpOnly cookies**  
- ✅ Protected secrets page  
- ✅ Logout  

---

## **Tech Stack**

- **Backend:** Node.js, Express.js  
- **Frontend:** EJS templates, HTML, CSS  
- **Database:** MongoDB Atlas  
- **Auth:** bcrypt, JSON Web Tokens (JWT)  
- **Deployment:** Render  

---

## **Installation**

```bash
git clone https://github.com/peaceful-pipelinista/SecretsWebApp.git
cd SecretsWebApp
npm install

````

1. Create a `.env` file in the root:

```
MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=any_secret_string
```

2. Start the app:

```bash
npm run dev
```

3. Open: `http://localhost:5000`

---



