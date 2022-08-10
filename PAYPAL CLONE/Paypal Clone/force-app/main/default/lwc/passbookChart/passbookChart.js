import { LightningElement,wire } from 'lwc';
import CreatedPassbooksPerMonth from '@salesforce/apex/PaypalDataController.CreatedPassbooksPerMonth';
import HighestTransactionPerMonth from '@salesforce/apex/PaypalDataController.GetHighestTransactionPerUser';
import HighestNumberOfTransaction from '@salesforce/apex/PaypalDataController.GetTransactionPerUser';

import chartjs from "@salesforce/resourceUrl/ChartJS1";
import { loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class Passbookchart extends LightningElement {
    chart;
    passbookChartConfig;
    monthsChart = ['JAN','FEB','MAR','APR','MAY','JUN','JUN','AUG','SEP','OCT','NOV','DEC',]
    colorChart = ["rgb(255, 0, 0)","rgb(255, 128, 0)","rgb(255, 255, 0)","rgb(128, 255, 0)","rgb(0, 255, 0)","rgb(0, 255, 128)","rgb(0, 255, 255)","rgb(0, 128, 255)","rgb(0, 0, 255)","rgb(128, 0, 255)","rgb(255, 0, 255)","rgb(255, 0, 128)",];
    //dataReloader
    passbookReloader;
    highTransactReloader;
    highNoTransactReloader;

    highTransactArrData = [];
    highNoTransactArrData = [];
    highNoTransactArrOption = [];

    @wire(HighestTransactionPerMonth)
    HighestTransact(results)
    {
      if(results.data)
      {
        this.highTransactReloader = results.data;
        for(let i =0; i<this.highTransactReloader.length;i++)
        {
          let highTransact = {
            TransactAmount: this.highTransactReloader[i].Amount,
            TransactMonth: this.highTransactReloader[i].DateMonth
          }
          this.highTransactArrData.push(highTransact);
        }
      }
      else if (results.error)
      {
        console.log(results.error);
      }
    }
    @wire(HighestNumberOfTransaction)
    HighestNoTransact(results)
    {
      if(results.data)
      {
        this.highNoTransactReloader = results.data;
        for(let i = 0; i<this.highNoTransactReloader.length;i++)
        {
          let transactPerUser = {
            Transaction: this.highNoTransactReloader[i].Transactions
          }
          this.highNoTransactArrData.push(transactPerUser);
          this.highNoTransactArrOption.push(this.highNoTransactReloader[i].Name);
        }
        results.error=undefined;
      }
      else if(results.error)
      {
        console.log(results.error)
        this.highNoTransactReloader = undefined;
      }
    }
    @wire(CreatedPassbooksPerMonth)
    SetPassbookForChart(results)
    {
        if(results.data)
        {
            this.passbookReloader = results.data;
            let passbookChart = [0,0,0,0,0,0,0,0,0,0,0,0];
            let highTransactArr = [0,0,0,0,0,0,0,0,0,0,0,0];
            for(let i = 0; i<this.highTransactArrData.length;i++)
            {
              let transact = parseInt(this.highTransactArrData[i].TransactAmount,10);
              let dateMonth = this.highTransactArrData[i].TransactMonth;
              highTransactArr.splice(dateMonth-1,1,transact);
            }
            for(let i = 0;i<this.passbookReloader.length;i++)
            {
                let date = parseInt(this.passbookReloader[i].Date_Time__c,10);
                let num = this.passbookReloader[i].Name;
                passbookChart.splice(date-1,1,num);
            }
            this.passbookChartConfig = {
                type: "bar",
                data: {
                labels: this.monthsChart,
                datasets: [
                    {
                    axis:'y',
                    label: "Created Passbooks",
                    data: passbookChart,
                    backgroundColor: this.colorChart
                    },
                    {
                      axis:'y',
                      label: "Highest Transaction",
                      data: highTransactArr,
                      backgroundColor: this.colorChart
                    },
                ]
                }
            };
            results.error = undefined;
        }
        else if(results.error)
        {
            console.log(results.error);
            this.passbookReloader = undefined;
        }
    }

    renderedCallback()
    {
        Promise.all([loadScript(this, chartjs)])
        .then(() => {
          const ctx = this.template.querySelector("canvas.passbooks");
          this.chart = new window.Chart(ctx, this.passbookChartConfig);
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