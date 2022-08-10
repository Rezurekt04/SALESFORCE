import { LightningElement,wire } from 'lwc';

import palList from '@salesforce/apex/PaypalDataController.GetPals';

import chartjs from "@salesforce/resourceUrl/ChartJS1";
import { loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class CardsChart extends LightningElement {

    chart;
    palsChartConfig;
    palsReloader;

    colorChart = ["rgb(255, 0, 0)","rgb(255, 128, 0)","rgb(255, 255, 0)","rgb(128, 255, 0)","rgb(0, 255, 0)","rgb(0, 255, 128)","rgb(0, 255, 255)","rgb(0, 128, 255)","rgb(0, 0, 255)","rgb(128, 0, 255)","rgb(255, 0, 255)","rgb(255, 0, 128)",];
    
    palArr = [];
    palOptionArr = [];
    @wire(palList)
    SetPalsForChart(results)
    {
        if(results.data)
        {
            this.palsReloader = results.data;
            console.log(this.palsReloader);
            this.palArr =[];
            this.palOptionArr = [];
            for(let i = 0; i<this.palsReloader.length;i++)
            {
                let pal = this.palsReloader[i].Name;
                let palCat = this.palsReloader[i].Type__c;
                this.palArr.push(pal);
                this.palOptionArr.push(palCat);
            }
            console.log(this.palArr);
            console.log(this.palOptionArr);
            this.palsChartConfig = {
                type: "bar",
                data: {
                labels: this.palOptionArr,
                datasets: [
                    {
                    axis:'y',
                    label: "Pals Per Category",
                    data: this.palArr,
                    backgroundColor: this.colorChart
                    }
                ]
                },
                options: {
                  scales: {
                    yAxes: [{
                        ticks: {
                          beginAtZero:true,
                          fixedStepSize: 1
                        }
                    }],
                }
                }
            };
            results.error=undefined;
        }else if(results.error)
        {
            console.log(results.error);
        }
    }

    renderedCallback()
    {
        Promise.all([loadScript(this, chartjs)])
        .then(() => {
          const ctx = this.template.querySelector("canvas.pals");
          this.chart = new window.Chart(ctx, this.palsChartConfig);
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