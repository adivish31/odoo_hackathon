import { ReportResponse } from "@/types/report";


export async function getReports(): Promise<ReportResponse>{


  return {

    kpis:[
      {
        title:"Fuel Efficiency",
        value:8.4,
        unit:"km/l",
        trend:"+1.2% vs last month"
      },

      {
        title:"Fleet Utilization",
        value:81,
        unit:"%",
        trend:"+4.5% vs last month"
      },

      {
        title:"Operational Cost",
        value:"₹34,070",
        trend:"+8.1% vs last month"
      },

      {
        title:"Vehicle ROI",
        value:14.2,
        unit:"%",
        trend:"Steady growth"
      }

    ],


    revenue:[

      {
        month:"Jan",
        planned:40000,
        actual:50000
      },

      {
        month:"Feb",
        planned:50000,
        actual:60000
      },

      {
        month:"Mar",
        planned:45000,
        actual:65000
      },

      {
        month:"Apr",
        planned:60000,
        actual:75000
      }

    ],


    vehicles:[

      {
        vehicleId:"TRUCK-II",
        cost:12450
      },

      {
        vehicleId:"MINI-03",
        cost:8200
      },

      {
        vehicleId:"VAN-05",
        cost:5100
      }

    ],


    operations:[

      {
        region:"North",
        trips:1245,
        fuelCost:"₹14.2/km",
        maintenance:"12.5%",
        status:"Optimal"
      },


      {
        region:"West",
        trips:892,
        fuelCost:"₹16.8/km",
        maintenance:"18.2%",
        status:"Warning"
      },


      {
        region:"South",
        trips:1532,
        fuelCost:"₹13.5/km",
        maintenance:"9.1%",
        status:"Optimal"
      }

    ]

  };

}