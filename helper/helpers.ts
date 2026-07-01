import moment from "moment"

export const calculateDaysOfStay=(checkInDate:Date,checkOutDate:Date)=>{
    const startDate=moment(checkInDate);
    const endDate=moment(checkOutDate);
    const diff = endDate.diff(startDate, 'days');
    return diff === 0 ? 1 : diff;
   
}