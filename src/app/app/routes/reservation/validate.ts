import { error } from "./interface";

export function validate(name:string, phone_number:string, service:string, datetimestring:string){
    const error: error = {}
    
    const datetime : Date = new Date(datetimestring)
    if(datetime < new Date()){
      error.invalidDatetime="We can't time travel"
    } else if(datetime.getHours() < 9 || datetime.getHours() > 21){
      error.invalidDatetime="We only open from 09.00 AM - 09.00 PM"
    }
    const year = datetime.getFullYear();
    const month = datetime.getMonth() + 1;
    const day = datetime.getDate();
    
    if (name.length === 0){
      error.invalidName = "Invalid name"
    } else if (name.length < 4){
      error.invalidName = "At least 4 characters"
    }
    
    if(phone_number.length < 8){
      error.invalidPhoneNumber = "At least 8 number"
    }
    const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const time = `${datetime.getHours()}:${datetime.getMinutes()}`;
    
    console.log(name);
    console.log(phone_number);
    console.log(service);
    console.log(datetimestring);
    console.log(date);
    console.log(time);

    return Object.keys(error).length ? error : null
}