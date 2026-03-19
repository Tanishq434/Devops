# 🚀 Docker Containerization Assignment

---

## 📌 Overview

This project demonstrates the containerization of a web application using **Docker, Docker Compose, and PostgreSQL**. The system follows a multi-container architecture with a **FastAPI backend** and **PostgreSQL database**, designed for scalable and production-ready deployment.

---

## 🎯 Objective

* Containerize a backend application  
* Use **Docker Compose** for orchestration  
* Enable communication between services using Docker networking  
* Ensure **data persistence using volumes**  
* Build a structured and production-ready setup  

---

## 🏗️ Project Structure


containerized-app/
│── backend/ # FastAPI application
│── database/ # PostgreSQL setup
│── screenshots/ # Output proof
│── docs/ # GitHub Pages report
│── docker-compose.yml # Orchestration file
│── .env # Environment variables
│── README.md # Documentation


---

## ⚙️ Technologies Used

* Docker & Docker Compose  
* FastAPI (Python)  
* PostgreSQL  
* REST API  

---

## 🔧 Setup Instructions

### Step 1: Clone Repository


git clone https://github.com/Tanishq434/Devops.git

cd Devops


---

### Step 2: Run Containers


docker-compose up --build


---

### Step 3: Check Running Containers


docker ps


---

## 🌐 API Endpoints

### 🔹 Health Check


GET /health


---

### 🔹 Create User


POST /users
Body:
{
"name": "Tanishq",
"email": "tanishqchauhan0132@gmail.com
"
}


---

### 🔹 Get Users


GET /users


---

## 🌍 Access Application


http://localhost:8000


Swagger Docs:


http://localhost:8000/docs


---

## 🔥 Key Features

* Multi-container architecture  
* FastAPI + PostgreSQL integration  
* Persistent storage using Docker volumes  
* REST API implementation  
* Scalable and modular design  

---

## 📸 Screenshots

Refer to the `screenshots/` folder for:

* Docker containers running  
* API testing (Swagger UI)  
* Database persistence  

---

## 📊 Results

* Application successfully containerized  
* Services communicate efficiently  
* Data persists after container restart  
* Easy deployment using Docker Compose  

---

## 📌 Conclusion

This project demonstrates containerization using Docker and Docker Compose. It highlights key DevOps practices such as orchestration, persistence, and modular architecture, making it suitable for real-world applications.

---

## 🌐 Live Report


https://tanishq434.github.io/Devops/Report.html


## Screenshots

### Docker Containers Running
![Docker PS](screenshots/docker-ls.png)

### IPvlan Network Inspect
![Network Inspect](screenshots/network-inspect.png)

### Volume Persistence Test
![Persistence](screenshots/persistence.png)


---

## 👨‍💻 Author

**Tanishq Chauhan**  
B.Tech CSE