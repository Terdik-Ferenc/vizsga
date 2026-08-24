- ---BACKEND---
- A backend szerver indítása.
- A backend virtuális környezetet érdemes egy külön könytárba telepíteni pl.
  ``` cmd
  py -m venv vizsga_env
  ```
-   Ezután aktiváljuk a virtuális környezetet a " vizsga_env\Scripts\activate " parancsal.
-   Belépünk a backend könytárunkba " cd backend "
-   Telepítjük a backend összetevőket " pip install -r requirements.txt "
- A backend szerver inditása a szokásos " py manage.py runserver ".
- 
- ---FRONTEND---
- React telepítés és szerver indítása.
- Belépünk a frontend könyvtárunkba " cd frontend "
- A react környezet telepítése " npm install ".
- A React frontend szerver indítása " npm run dev " parancsal.

