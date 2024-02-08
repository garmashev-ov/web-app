import "./leftside.css"
import { Link } from "react-router-dom"

export function LeftSide() {
    return (
        <div className="leftside">
            <div className="title_logo">
                <img src="/logo.png" alt="" />
                <h1>TrendWave</h1>
            </div>
            <header className="header">
                <Link className="nav-link" to="/"><button>Trend</button></Link>
                <Link className="nav-link" to="/create_post"><button>Create Post</button></Link>
                <Link className="nav-link" to="/messages"><button>Messages</button></Link>
                <Link className="nav-link" to="/profile"><button>Profile</button></Link>
                <Link className="nav-link" to="/settings"><button>Settings</button></Link>
            </header>
        </div>
    )
}