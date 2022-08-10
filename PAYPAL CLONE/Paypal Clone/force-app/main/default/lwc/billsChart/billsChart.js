import { LightningElement, wire } from 'lwc';
import BillCreated from '@salesforce/apex/PaypalDataController.GetBills';

import chartjs from "@salesforce/resourceUrl/ChartJS1";
import { loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class BillsChart extends LightningElement {
    walletChart;
    billReloader;
    billChartConfig;

    colorChart = ["rgb(255, 0, 0)","rgb(255, 128, 0)","rgb(255, 255, 0)","rgb(128, 255, 0)","rgb(0, 255, 0)","rgb(0, 255, 128)","rgb(0, 255, 255)","rgb(0, 128, 255)","rgb(0, 0, 255)","rgb(128, 0, 255)","rgb(255, 0, 255)","rgb(255, 0, 128)",];
    billsArr = [];
    billsOptionArr =[];

    @wire(BillCreated)
    SetBillForChart(results)
    {
        if(results.data)
        {
            this.billReloader=results.data;
            this.billsArr=[];
            this.billsOptionArr=[];
            for(let i = 0; i<this.billReloader.length;i++)
            {
                let billName = this.billReloader[i].Name;
                let billCat = this.billReloader[i].Category__c;
                this.billsArr.push(billName);
                this.billsOptionArr.push(billCat);
            }
            this.billChartConfig = {
                type: "bar",
                data: {
                labels: this.billsOptionArr,
                datasets: [
                    {
                    axis:'y',
                    label: "Bills Per Category",
                    data: this.billsArr,
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
            
        }
        else if(results.error)
        {
            console.log(results.error)
            this.billReloader = undefined;
        }
    }

    renderedCallback()
    {
        Promise.all([loadScript(this, chartjs)])
        .then(() => {
          const ctx = this.template.querySelector("canvas.bills");
          this.chart = new window.Chart(ctx, this.billChartConfig);
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