import { SalonSlogan, Contact1Name, Contact1Number, Contact2Name, Contact2Number, SalonName } from "../components/SalonStaticVar";

function MainFooter(){
    return (
        // MAIN FOOTER
        <footer className="bg-gray-100 pb-[5vh] mt-[10vh] relative z-20">
            <div className="container mx-auto px-0 flex flex-col items-center justify-between">
                <div className="flex flex-col xl:flex-row justify-around items-center w-full">
                    <div className="flex flex-col justify-around xl:justify-start items-center xl:items-start">
                        <h2 className="h2">{SalonName}</h2>
                        <p><em>{SalonSlogan}</em></p>
                        <br></br>
                    </div>
                    <div className="flex flex-col justify-around xl:justify-start items-center xl:items-start">
                        <h3 className="h3">Contact Information</h3>
                        <p>{Contact1Name} : {Contact1Number}</p>
                        <p>{Contact2Name} : {Contact2Number}</p>
                    </div>
                </div>
                <p className="mt-[10vh] text-[2vh]">Copyright &copy; SEA Salon 2024. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default MainFooter;