import { LightningElement, wire } from 'lwc';

import CardsCreated from '@salesforce/apex/PaypalDataController.GetCards';
import chartjs from "@salesforce/resourceUrl/ChartJS1";
import { loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CardsChart extends LightningElement {
    cardReloader;
    cardChartConfig;
    monthsChart = ['JAN','FEB','MAR','APR','MAY','JUN','JUN','AUG','SEP','OCT','NOV','DEC',]
    colorChart = ["rgb(255, 0, 0)","rgb(255, 128, 0)","rgb(255, 255, 0)","rgb(128, 255, 0)","rgb(0, 255, 0)","rgb(0, 255, 128)","rgb(0, 255, 255)","rgb(0, 128, 255)","rgb(0, 0, 255)","rgb(128, 0, 255)","rgb(255, 0, 255)","rgb(255, 0, 128)",];
    

    @wire(CardsCreated)
    SetCardsForChart(results)
    {
        if(results.data)
        {
            this.cardReloader =results.data;
            let cardDetails = [0,0,0,0,0,0,0,0,0,0,0,0];
            for(let i = 0;i<this.cardReloader.length;i++)
            {
                let date = parseInt(this.cardReloader[i].Month,10);
                let num = this.cardReloader[i].Spendings;
                cardDetails.splice(date-1,1,num);
            }
            this.cardChartConfig = {
                type: "bar",
                data: {
                labels: this.monthsChart,
                datasets: [
                    {
                    axis:'y',
                    label: "Cards Spending",
                    data: cardDetails,
                    backgroundColor: this.colorChart
                    }
                ]
                }
            };
            results.error=undefined;
        }
        else if(results.error)
        {
            console.log(results.error)
            this.cardReloader = undefined;
        }
    }

    renderedCallback()
    {
        Promise.all([loadScript(this, chartjs)])
        .then(() => {
          const ctx = this.template.querySelector("canvas.cards");
          this.chart = new window.Chart(ctx, this.cardChartConfig);
        })
        .catch((error) => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error",
              message: error.message,
              variant: "error"
            })
          );
        });
    }
}