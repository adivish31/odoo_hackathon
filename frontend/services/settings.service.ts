import { SettingsData } from "@/types/settings";


export async function getSettings():Promise<SettingsData>{


return {

depotName:"Gandhinagar Depot G-24",

currency:"INR",

distanceUnit:"Kilometers",


roles:[

{
role:"Fleet Manager",
fleet:"full",
drivers:"full",
trips:"full",
expenses:"full",
analytics:"full"
},


{
role:"Dispatcher",
fleet:"read",
drivers:"read",
trips:"full",
expenses:"none",
analytics:"read"
},


{
role:"Safety Officer",
fleet:"read",
drivers:"full",
trips:"read",
expenses:"none",
analytics:"read"
},


{
role:"Financial Analyst",
fleet:"read",
drivers:"read",
trips:"read",
expenses:"full",
analytics:"full"
}

]

}


}