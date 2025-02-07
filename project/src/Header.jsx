import './App.css';

export default function Header()
{
    function handleScroll() {
        const section = document.getElementById("characters-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the section
        }
    }
    return(
        <div className="header">
        <h1 className="Ricky">Ricky & Morty</h1>
        <button className="character_btn" onClick={handleScroll}>Characters</button>
        </div>
    )
}