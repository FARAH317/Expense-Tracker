# Expense Tracker
Application de suivi des dépenses avec une API Django REST Framework et une interface React/Vite.
## Technologies
- Backend : Python, Django, Django REST Framework et JWT
- Frontend : React, Vite et Axios
- Base de données de développement : SQLite
## Structure
```text
backend/
	config/                  Projet Django et commande manage.py
	expense_tracker/         Application Django principale
frontend/
	src/                     Application React
```
## Installation
### Backend
```bash
cd backend/config
python -m venv .venv
.venv\Scripts\activate
pip install django djangorestframework djangorestframework-simplejwt
python manage.py migrate
python manage.py runserver
```
L'API est disponible sur `http://127.0.0.1:8000/api/`.
### Frontend
Dans un second terminal :
```bash
cd frontend
npm install
npm run dev
```
L'interface est disponible sur l'URL affichée par Vite. Le proxy Vite redirige `/api` vers Django sur le port `8000`.
## Fonctionnalités
- Authentification JWT
- Isolation des transactions et budgets par utilisateur
- Tableau de bord avec revenus, dépenses, solde et répartition par catégorie
- Filtres par date, catégorie et type de transaction
- Budgets mensuels avec détection des dépassements
## Endpoints principaux
| Méthode | URL | Description |
| --- | --- | --- |
| POST | `/api/token/` | Connexion et obtention des tokens JWT |
| POST | `/api/token/refresh/` | Actualisation du token d'accès |
| GET | `/api/categories/` | Liste des catégories |
| GET/POST | `/api/transactions/` | Liste et création des transactions |
| GET | `/api/transactions/summary/` | Résumé pour le tableau de bord |
| GET/POST | `/api/budgets/` | Liste et création des budgets |
## Vérifications
```bash
cd backend/config
python manage.py check
python manage.py test
cd ../../frontend
npm run build
```
