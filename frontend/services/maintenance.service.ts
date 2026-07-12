import { MaintenanceData } from "@/types/maintenance";


export async function getMaintenance()
:Promise<MaintenanceData>{


return {


kpis:[
 {
  title:"Monthly Spend",
  value:"₹12,450",
  icon:"payments"
 },
 {
  title:"Units In Shop",
  value:"05",
  icon:"precision_manufacturing"
 },
 {
  title:"Overdue Service",
  value:"02",
  icon:"warning"
 }
],



records:[

{
 id:"1",
 vehicle:"VAN-05",
 model:"Ford Transit 2022",
 service:"Oil Change & Filter",
 cost:2500,
 status:"IN SHOP",
 date:"2026-07-10"
},


{
 id:"2",
 vehicle:"TRUCK-11",
 model:"Volvo VNL 860",
 service:"Engine Repair",
 cost:18000,
 status:"COMPLETED",
 date:"2026-07-08"
},


{
 id:"3",
 vehicle:"MINI-02",
 model:"Mini Cooper SE",
 service:"Tyre Replacement",
 cost:6200,
 status:"IN SHOP",
 date:"2026-07-05"
}

]

}

}