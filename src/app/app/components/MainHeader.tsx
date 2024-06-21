import { SalonName } from "./SalonStaticVar";

function MainHeader(){
    return (
        // MAIN HEADER
        <header className="sticky top-0 h-[90px] shadow-xl z-30 bg-white flex items-center">
            <h1 className="text-3xl sm:w-[35%] md:w-[25%] lg:[20%] xl:w-[15%] 2xl:w-[10%] ml-4 flex justify-center mx-auto">{SalonName}</h1>
        </header>
    );
}

export default MainHeader;