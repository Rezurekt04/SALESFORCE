import { LightningElement,wire } from 'lwc';
import WalletsCreated from '@salesforce/apex/PaypalDataController.GetWallets';

import chartjs from "@salesforce/resourceUrl/ChartJS1";
import { loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class WalletChart extends LightningElement {
    walletChart;
    walletReloader;
    walletChartConfig;

    monthsChart = ['JAN','FEB','MAR','APR','MAY','JUN','JUN','AUG','SEP','OCT','NOV','DEC',]
    colorChart = ["rgb(255, 0, 0)","rgb(255, 128, 0)","rgb(255, 255, 0)","rgb(128, 255, 0)","rgb(0, 255, 0)","rgb(0, 255, 128)","rgb(0, 255, 255)","rgb(0, 128, 255)","rgb(0, 0, 255)","rgb(128, 0, 255)","rgb(255, 0, 255)","rgb(255, 0, 128)",];
    
    walletArr = [];
    walletOptionArr =[];
    @wire(WalletsCreated)
    SetWalletForChart(results)
    {
        if(results.data)
        {
            this.walletReloader = results.data;
            this.walletArr = [];
            this.walletOptionArr = [];
            for(let i =0; i<this.walletReloader.length;i++)
            {
                let addedFrom = this.walletReloader[i].Added_From__c;
                let wallet = this.walletReloader[i].Name;
                this.walletArr.push(wallet);
                this.walletOptionArr.push(addedFrom);
            }
            this.walletChartConfig = {
                type: "bar",
                data: {
                labels: this.walletOptionArr,
                datasets: [
                    {
                    axis:'y',
                    label: "Wallet Per Category",
                    data: this.walletArr,
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
            results.error = undefined;
        }
        else if(results.error)
        {
            console.log(results.error);
        }
    }
    renderedCallback()
    {
        Promise.all([loadScript(this, chartjs)])
        .then(() => {
          const ctx = this.template.querySelector("canvas.wallets");
          this.chart = new window.Chart(ctx, this.walletChartConfig);
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