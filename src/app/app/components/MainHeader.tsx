import { NavLink } from "@remix-run/react";
import { SalonName } from "./SalonStaticVar";

function MainHeader(){
    return (
        // MAIN HEADER
        <header className="sticky top-0 h-[90px] shadow-xl z-30 bg-white flex items-center">
            <div className="flex w-full justify-start items-center">
                <div className="flex justify-center sm:w-[35vw] md:w-[25vw] lg:[20vw] xl:w-[15vw] 2xl:w-[10vw] ml-4">
                    <NavLink 
                        to="/" 
                        preventScrollReset
                        className="text-3xl flex justify-center mx-auto"
                    >
                        {SalonName}
                    </NavLink>
                </div>
                {/* Main Navigation */}
                <div className="flex justify-start sm:w-[35vw] md:w-[25vw] lg:[50vw] xl:w-[50vw] 2xl:w-[60vw] ml-10">
                    <nav id="main-navigation">
                        <ul className="flex justify-start">
                            <li className="nav-item">
                                <NavLink preventScrollReset to="/reservation">Reservation</NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default MainHeader;