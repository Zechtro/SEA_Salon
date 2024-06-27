import { NavLink } from "@remix-run/react";
import { SalonName } from "./SalonStaticVar";

function MainHeader(){
    return (
        // MAIN HEADER
        <header className="sticky top-0 h-[90px] shadow-xl z-30 bg-white flex items-center">
            <div className="flex justify-between items-center w-full">    
                <div className="flex w-[70vw] justify-start items-center">
                    <div className="flex justify-center items-center sm:w-[35vw] md:w-[25vw] lg:[20vw] xl:w-[15vw] 2xl:w-[10vw] ml-4">
                        <NavLink 
                            to="/" 
                            preventScrollReset
                            className="text-3xl flex justify-center mx-auto"
                        >
                            {SalonName}
                        </NavLink>
                    </div>
                    {/* Main Navigation */}
                    <div className="sm:hidden lg:flex justify-start items-center sm:w-[10vw] md:w-[25vw] lg:[50vw] xl:w-[50vw] 2xl:w-[60vw] ml-10">
                        <nav id="main-navigation">
                            <ul className="flex justify-start">
                                <li className="nav-item">
                                    <NavLink preventScrollReset to="/reservation">Reservation</NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                {/* Sign Up | Login */}
                <div className="flex justify-end w-[30vw]">
                    <nav id="login" className="flex justify-end w-[20vw]">
                        <ul className="flex w-[30vw] justify-around">
                            <li className="flex justify-center nav-item sm:w-[15vw] lg:w-[8vw]">
                                <NavLink preventScrollReset to="/signup">Sign Up</NavLink>
                            </li>
                            <li className="flex justify-center nav-item sm:w-[15vw] lg:w-[8vw]">
                                <NavLink preventScrollReset to="/login">Login</NavLink>
                            </li>
                            <li className="flex justify-center nav-item sm:w-[15vw] lg:w-[8vw]">
                                <NavLink preventScrollReset to="/">Logout</NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default MainHeader;