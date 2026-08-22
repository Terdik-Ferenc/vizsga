import { Link } from "react-router-dom";
import "../styles/home.css";

function Home()
{
    return(
        <div className="home-page">
            <section className="hero-section">
                <video 
                    className="hero-video" 
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                <source src="/videos/kezdőoldal.webm" type="video/webm"/>
                    </video>
                </section>

                <div className="hero-content">
                    <h1>Galaxy Portál</h1>
                    <p>Üdvözlünk a Galaxy Portál honlapján!

A Galaxy Portal egy csillagászati és űrkutatási portál, amelynek célja, hogy közelebb hozza az univerzum lenyűgöző világát minden érdeklődő számára. Fedezd fel bolygóinkat, csillagainkat, galaxisainkat és más égitesteket, valamint olvass érdekes cikkeket és ismeretterjesztő tartalmakat a világegyetem működéséről.

Regisztrált felhasználóként további lehetőségek is várnak rád: jelentkezhetsz eseményeinkre, részletes információkat érhetsz el az égitestekről, és exkluzív tartalmakhoz férhetsz hozzá.

Csatlakozz a Galaxy Portal közösségéhez, és indulj el velünk a világűr felfedezésére! 🚀✨</p>

                    

                </div>


            
            

        </div>
    );
}
export default Home;