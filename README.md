## BACKEND
- A backend szerver indítása.
- A backend virtuális környezetet érdemes egy külön könytárba telepíteni pl.
  ``` cmd
  py -m venv vizsga_env
  ```
-   Ezután aktiváljuk a virtuális környezetet a
  ``` cmd
    vizsga_env\Scripts\activate
  ```
 parancsal.
-   Belépünk a backend könytárunkba
    ``` cmd
    cd backend
    ```
-   Telepítjük a backend összetevőket
  ``` cmd
  pip install -r requirements.txt
  ```
- A backend szerver inditása a szokásos
  ``` cmd
  py manage.py runserver
  ```
  
## FRONTEND
- React telepítés és szerver indítása.
- Belépünk a frontend könyvtárunkba
  ``` cmd
  cd frontend
  ```
- A react környezet telepítése
  ``` cmd
  npm install
  ```
- A React frontend szerver indítása
  ``` cmd
  npm run dev
  ```
  parancsal.

