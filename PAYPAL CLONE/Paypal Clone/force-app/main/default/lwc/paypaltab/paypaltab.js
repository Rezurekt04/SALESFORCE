import { LightningElement,wire,track, api } from 'lwc';

//field List
//users
import UserObject from '@salesforce/schema/Users__c';
import UserName from '@salesforce/schema/Users__c.Name';
import UserEmail from '@salesforce/schema/Users__c.Email__c';
import UserPhone from '@salesforce/schema/Users__c.Mobile_Number__c';
import UserAccount from '@salesforce/schema/Users__c.User_Account__c';
//passbooks
import PassbookObject from '@salesforce/schema/Passbook__c';
import PassbookName from '@salesforce/schema/Passbook__c.Name';
import PassbookExpense from '@salesforce/schema/Passbook__c.Expense_Description__c';
import PassbookAmount from '@salesforce/schema/Passbook__c.Amount__c';
import PassbookComments from '@salesforce/schema/Passbook__c.Comments__c';
import PassbookDate from '@salesforce/schema/Passbook__c.Date_Time__c';
import PassbookUser from '@salesforce/schema/Passbook__c.User__c';
//wallets
import WalletObject from '@salesforce/schema/Wallet__c';
import WalletBalance from '@salesforce/schema/Wallet__c.Balance__c';
import WalletAdded from '@salesforce/schema/Wallet__c.Added_From__c';
import WalletDate from '@salesforce/schema/Wallet__c.Date_Time__c';
import WalletUser from '@salesforce/schema/Wallet__c.User__c';
//pals
import PalObject from '@salesforce/schema/Pals__c';
import PalUser from '@salesforce/schema/Pals__c.Paypal_User__c';
import PalType from '@salesforce/schema/Pals__c.Type__c';
//bills
import BillObject from '@salesforce/schema/Bills__c';
import BillLocation from '@salesforce/schema/Bills__c.Location__c';
import BillCategory from '@salesforce/schema/Bills__c.Category__c';
import BillAmount from '@salesforce/schema/Bills__c.Amount__c';
import BillPayBefore from '@salesforce/schema/Bills__c.Pay_Before__c';
import BillForUser from '@salesforce/schema/Bills__c.For_User__c';
//cards
import CardObject from '@salesforce/schema/Cards__c';
import CardNumber from '@salesforce/schema/Cards__c.Card_Number__c';
import CardExpiry from '@salesforce/schema/Cards__c.Expiry_Date__c';
import CardCVV from '@salesforce/schema/Cards__c.CVV__c';
import CardName from '@salesforce/schema/Cards__c.Card_Name__c';
import CardSpendings from '@salesforce/schema/Cards__c.Total_Spendings__c';




//icon
import paypalIcon from '@salesforce/resourceUrl/Logo2';

//Object Lists for Tables
import UserList from '@salesforce/apex/PaypalDataController.PaypalUsers';
import PassBookList from '@salesforce/apex/PaypalDataController.PassbookList';
import WalletList from '@salesforce/apex/PaypalDataController.WalletList';
import PalsList from '@salesforce/apex/PaypalDataController.PalsList';
import BillsList from '@salesforce/apex/PaypalDataController.BillList';
import CardsList from '@salesforce/apex/PaypalDataController.CardList';

//List for RightColumn
import userActivityList from '@salesforce/apex/PaypalDataController.GetUserActivity';

//Object Lists for Charts
import CreatedUserPerMonth from '@salesforce/apex/PaypalDataController.CreatedUserMonth';
import CreatedPassbooksPerMonth from '@salesforce/apex/PaypalDataController.CreatedPassbooksPerMonth';
import HighestTransactionPerMonth from '@salesforce/apex/PaypalDataController.GetHighestTransactionPerUser';
import HighestNumberOfTransaction from '@salesforce/apex/PaypalDataController.GetTransactionPerUser';
import WalletsCreated from '@salesforce/apex/PaypalDataController.GetWallets';
import palList from '@salesforce/apex/PaypalDataController.GetPals';
import BillCreated from '@salesforce/apex/PaypalDataController.GetBills';
import CardsCreated from '@salesforce/apex/PaypalDataController.GetCards';

//important
import {refreshApex} from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';
import chartjs from "@salesforce/resourceUrl/ChartJS1";
import { loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

//actions and datacolumns
//admin
const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' }
];
const passbookActions = [
    { label: 'Show details', name: 'passbook_details' },
    { label: 'Delete', name: 'delete' }
];
const walletActions = [
    { label: 'Show details', name: 'wallet_details' },
    { label: 'Delete', name: 'delete' }
];
const palsActions = [
    { label: 'Show details', name: 'pal_details' },
    { label: 'Delete', name: 'delete' }
];
const billsActions = [
    { label: 'Show details', name: 'bill_details' },
    { label: 'Delete', name: 'delete' }
];
const cardsActions = [
    { label: 'Show details', name: 'card_details' },
    { label: 'Delete', name: 'delete' }
];
const UserFields = [
    {label:'Name', fieldName: 'Name', type:'text'},
    {label:'User Account', fieldName: 'User_Account__c', type:'text'},
    {label:'Email', fieldName: 'Email__c', type:'text'},
    {label:'Mobile Number', fieldName: 'Mobile_Number__c', type:'text'},
    { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'auto' } }
];
const PassbookFields = [
    {label:'Name', fieldName: 'Name', type:'text'},
    {label:'Expense Description', fieldName: 'Expense_Description__c', type:'text'},
    {label:'Amount', fieldName: 'Amount__c', type:'text'},
    {label:'Comments', fieldName: 'Comments__c', type:'text'},
    {label:'Date/Time', fieldName: 'Date_Time__c', type:'text'},
    {label:'User Name', fieldName: 'User__c', type:'text'},
    {label:'Flagged', fieldName: 'Flagged__c', type:'boolean'},
    { type: 'action', typeAttributes: { rowActions: passbookActions, menuAlignment: 'auto' } }
];
const WalletFields = [
    {label:'Name', fieldName: 'Name', type:'text'},
    {label:'Balance', fieldName: 'Balance__c', type:'text'},
    {label:'Added From', fieldName: 'Added_From__c', type:'text'},
    {label:'Date/Time', fieldName: 'Date_Time__c', type:'text'},
    { type: 'action', typeAttributes: { rowActions: walletActions, menuAlignment: 'auto' } }
];
const PalsFields = [
    {label:'Name', fieldName: 'Name', type:'text'},
    {label:'Paypal User', fieldName: 'Paypal_User__c', type:'text'},
    {label:'Type', fieldName: 'Type__c', type:'text'},
    { type: 'action', typeAttributes: { rowActions: palsActions, menuAlignment: 'auto' } }
];
const BillsField = [
    {label:'Name', fieldName: 'Name', type:'text'},
    {label:'Location', fieldName: 'Location__c', type:'text'},
    {label:'Category', fieldName: 'Category__c', type:'text'},
    {label:'Amount', fieldName: 'Amount__c', type:'text'},
    {label:'Offer Applied', fieldName: 'Offer_Applied__c', type:'text'},
    {label:'Pay Before', fieldName: 'Pay_Before__c', type:'text'},
    {label:'Status', fieldName: 'Paid_Status__c', type:'boolean'},
    {label:'For User', fieldName: 'For_User__c', type:'text'},
    { type: 'action', typeAttributes: { rowActions: billsActions, menuAlignment: 'auto' } }
];
const CardsField = [
    {label:'Name', fieldName: 'Name', type:'text'},
    {label:'Card Name', fieldName: 'Card_Name__c', type:'text'},
    {label:'Expiry Date', fieldName: 'Expiry_Date__c', type:'text'},
    {label:'Card Number', fieldName: 'Card_Number__c', type:'text'},
    {label:'CVV', fieldName: 'CVV__c', type:'text'},
    {label:'Total Spendings', fieldName: 'Total_Spendings__c', type:'text'},
    { type: 'action', typeAttributes: { rowActions: cardsActions, menuAlignment: 'auto' } }
];
//customerAction
const customerUserActions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' }
];



export default class Paypaltab extends LightningElement {

    //icon
    icon = paypalIcon;
    //DatatableColumns
    userColumns = UserFields;
    passbookColumns = PassbookFields;
    walletColumns = WalletFields;
    palsColumns = PalsFields;
    billsColumn = BillsField;
    cardsColumn = CardsField;
    //refreshApexVariables
    refreshUser;
    refreshPassbooks;
    refreshWallets;
    refreshPals;
    refreshBills;
    refreshCards;
    //Datatable Data
    wiredUsers = [];
    wiredPassbooks = [];
    wiredWallets = [];
    wiredPals = [];
    wiredBills = [];
    wiredCards = [];
    //DataWired
    wiredDataUsers;
    wiredDataPassbooks;
    wiredDataWallets;
    wireDataPals;
    wireDataBills;
    wireDataCards;
    //UserTab Config
    @wire(UserList)
    UserObjectValidation(results)
    {
        if(results.data)
        {
            this.refreshUser = results;
            this.wiredUsers = [];
            this.wiredDataUsers= results.data;
            for(let i = 0; i<this.wiredDataUsers.length;i++)
            {
                let user = {
                    Id: this.wiredDataUsers[i].Id,
                    Name: this.wiredDataUsers[i].Name,
                    User_Account__c: this.wiredDataUsers[i].User_Account__r?.Name,
                    Email__c: this.wiredDataUsers[i].Email__c,
                    Mobile_Number__c: this.wiredDataUsers[i].Mobile_Number__c
                }
                this.wiredUsers.push(user);
            }
            results.error = undefined;
        }
        else if(results.error)
        {
            console.log(results.error);
            this.wiredDataUsers = undefined;
        }
    }
    //PassbookTab Config
    @wire(PassBookList)
    PassbookObjectValidation(results)
    {
        this.refreshPassbooks = results;
        if(results.data)
        {
            this.wiredPassbooks = [];
            this.wiredDataPassbooks = results.data;
            for(let i = 0; i<this.wiredDataPassbooks.length;i++)
            {
                let passbook = {
                    Id: this.wiredDataPassbooks[i].Id,
                    Name: this.wiredDataPassbooks[i].Name,
                    Expense_Description__c: this.wiredDataPassbooks[i].Expense_Description__c,
                    Amount__c: this.wiredDataPassbooks[i].Amount__c,
                    Comments__c: this.wiredDataPassbooks[i].Comments__c,
                    Date_Time__c: this.wiredDataPassbooks[i].Date_Time__c,
                    User__c: this.wiredDataPassbooks[i].User__r?.Name,
                    Flagged__c: this.wiredDataPassbooks[i].Flagged__c
                }
                this.wiredPassbooks.push(passbook)
            }
            results.error=undefined;
        }
        else if(results.error)
        {
            console.log(results.error);
            this.wiredDataPassbooks = undefined;
        }
    }
    //WalletsTab Config
    @wire(WalletList)
    WalletObjectValidation(results)
    {
        this.refreshWallets = results;
        if(results.data)
        {
            this.wiredWallets = results.data;
            results.error = undefined;
        }
        else if(results.error)
        {
            console.log(results.error);
            this.wiredWallets = undefined;
        }
    }
    //PalsTab Config
    @wire(PalsList)
    PalsObjectValidation(results)
    {
        this.refreshPals = results;
        if(results.data)
        {
            this.wiredPals = [];
            this.wireDataPals = results.data;
            for(let i = 0; i<this.wireDataPals.length;i++)
            {
                let pal = {
                    Id: this.wireDataPals[i].Id,
                    Name: this.wireDataPals[i].Name,
                    Paypal_User__c: this.wireDataPals[i].Paypal_User__r?.Name,
                    Type__c: this.wireDataPals[i].Type__c
                }
                this.wiredPals.push(pal)
            }
            results.error=undefined;
        }
        else if(results.error)
        {
            console.log(results.error);
            this.wireDataPals = undefined;
        }
    }
    //BillsTab Config
    @wire(BillsList)
    BillsObjectValidation(results)
    {
        this.refreshBills = results;
        if(results.data)
        {
            this.wiredBills = [];
            this.wireDataBills = results.data;
            for(let i = 0; i<this.wireDataBills.length;i++)
            {
                let bill = {
                    Id: this.wireDataBills[i].Id,
                    Name: this.wireDataBills[i].Name,
                    Location__c: this.wireDataBills[i].Location__c,
                    Category__c: this.wireDataBills[i].Category__c,
                    Amount__c: this.wireDataBills[i].Amount__c,
                    Offer_Applied__c: this.wireDataBills[i].Offer_Applied__c,
                    Pay_Before__c: this.wireDataBills[i].Pay_Before__c,
                    Paid_Status__c: this.wireDataBills[i].Paid_Status__c,
                    For_User__c: this.wireDataBills[i].For_User__r?.Name
                }
                this.wiredBills.push(bill)
            }
        }
        else if(results.error)
        {
            console.log(results.error);
            this.wiredBills = undefined;
        }
    }
    //Cards Config
    @wire(CardsList)
    CardsObjectValidation(results)
    {
        this.refreshCards = results;
        if(results.data)
        {
            this.wiredCards = [];
            this.wireDataCards = results.data;
            for(let i = 0; i<this.wireDataCards.length;i++)
            {
                let card = {
                    Id: this.wireDataCards[i].Id,
                    Name: this.wireDataCards[i].Name,
                    Card_Name__c: this.wireDataCards[i].Card_Name__r?.Name,
                    Expiry_Date__c: this.wireDataCards[i].Expiry_Date__c,
                    Card_Number__c: this.wireDataCards[i].Card_Number__c,
                    CVV__c: this.wireDataCards[i].CVV__c,
                    Total_Spendings__c: this.wireDataCards[i].Total_Spendings__c
                }
                this.wiredCards.push(card)
            }
        }
        else if(results.error)
        {
            console.log(results.error);
            this.wireDataCards = undefined;
        }
    }
    
    //2ndColumnCodes
    wiredUserActivities = [];
    wiredUserActivitiesReloader;

    @wire(userActivityList)
    IterateUserActivityList(results)
    {
        if(results.data)
        {
            this.wiredUserActivitiesReloader = results.data;
            this.wiredUserActivities = [];
            for(let i = 0;i<this.wiredUserActivitiesReloader.length;i++)
            {
                let icon;
                if(this.wiredUserActivitiesReloader[i].Subject === 'Email')
                {
                    icon = 'standard:email_chatter';
                }
                else if(this.wiredUserActivitiesReloader[i].Subject === 'Call')
                {
                    icon = 'standard:call';
                }
                else if(this.wiredUserActivitiesReloader[i].Subject === 'Meeting')
                {
                    icon = 'standard:service_appointment';
                }
                else if(this.wiredUserActivitiesReloader[i].Subject === 'Sender Letter/Quote')
                {
                    icon = 'standard:quotes';
                }
                else if(this.wiredUserActivitiesReloader[i].Subject === 'Other')
                {
                    icon = 'standard:app';
                }
                let activity = {
                    Icon: icon,
                    Type: this.wiredUserActivitiesReloader[i].Subject,
                    UserName: this.wiredUserActivitiesReloader[i].What.Name,
                    Assign: this.wiredUserActivitiesReloader[i].Owner.Name,
                    Description: this.wiredUserActivitiesReloader[i].Description
                }
                this.wiredUserActivities.push(activity);
            }
            results.error = undefined;
        }else if(results.error)
        {
            console.log(results.error);
            this.wiredUserActivitiesReloader = undefined;
        }
    }
    //ChartCodes
    chart;

    //chartConfigs
    userChartConfig;
    passbookChartConfig;
    walletChartConfig;
    palsChartConfig;
    billChartConfig;
    cardChartConfig;

    monthsChart = ['JAN','FEB','MAR','APR','MAY','JUN','JUN','AUG','SEP','OCT','NOV','DEC',]
    colorChart = ["rgb(255, 0, 0)","rgb(255, 128, 0)","rgb(255, 255, 0)","rgb(128, 255, 0)","rgb(0, 255, 0)","rgb(0, 255, 128)","rgb(0, 255, 255)","rgb(0, 128, 255)","rgb(0, 0, 255)","rgb(128, 0, 255)","rgb(255, 0, 255)","rgb(255, 0, 128)",];
    //userChartReloader
    usersReloader;
    passbookReloader;
    highTransactReloader;
    highNoTransactReloader;
    walletReloader;
    palsReloader;
    billsReloader;
    cardReloader;



    @wire(CreatedUserPerMonth)
    SetUsersForChart(results)
    {
        if(results.data)
        {
            this.usersReloader = results.data;
            let userChart = [0,0,0,0,0,0,0,0,0,0,0,0];
            for(let i =0; i<this.usersReloader.length;i++)
            {
                let date = parseInt(this.usersReloader[i].CreateDate,10);
                let num = this.usersReloader[i].Name;
                userChart.splice(date-1,1,num);
            }
            this.userChartConfig = {
                type: "bar",
                data: {
                labels: this.monthsChart,
                datasets: [
                    {
                    axis:'y',
                    label: "New Users per Month",
                    data: userChart,
                    backgroundColor: this.colorChart
                    }
                ]
                }
            };
            results.error = undefined;
        }
        else if(results.error)
        {
            this.usersReloader=undefined;
        }
    }


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
              let dateMonth = parseInt(this.highTransactArrData[i].TransactAmount,10);
              let transact = this.highTransactArrData[i].TransactMonth;
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
                    label: "My First Dataset",
                    data: passbookChart,
                    backgroundColor: this.colorChart
                    },
                    {
                    axis:'y',
                    label: "My First Dataset",
                    data: highTransactArr,
                    backgroundColor: this.colorChart
                    } ,
                    {
                        axis:'y',
                        label: "My First Dataset",
                        data: highTransactArr,
                        backgroundColor: this.colorChart
                    } 
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
                    label: "Wallet Per Category",
                    data: this.walletArr,
                    backgroundColor: this.colorChart
                    }
                ]
                }
            };
            results.error = undefined;
        }
        else if(results.error)
        {
            console.log(results.error);
        }
    }

    palArr = [];
    palOptionArr = [];
    @wire(palList)
    SetPalsForChart(results)
    {
        if(results.data)
        {
            this.palsReloader = results.data;
            this.palArr =[];
            this.palOptionArr = [];
            for(let i = 0; i<this.palsReloader.length;i++)
            {
                let pal = this.palsReloader[i].Name;
                let palCat = this.palsReloader[i].Type__c;
                this.palArr.push(pal);
                this.palOptionArr.push(palCat);
            }
            this.palsChartConfig = {
                type: "bar",
                data: {
                labels: this.palOptionArr,
                datasets: [
                    {
                    label: "Wallet Per Category",
                    data: this.palArr,
                    backgroundColor: this.colorChart
                    }
                ]
                }
            };
            results.error=undefined;
        }else if(results.error)
        {
            console.log(results.error);
        }
    }

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

    @wire(CardsCreated)
    SetCardsForChart(results)
    {
        if(results.data)
        {
            this.cardReloader =results.data;
            console.log(this.cardReloader);
            let cardDetails = [0,0,0,0,0,0,0,0,0,0,0,0];
            for(let i = 0;i<this.cardReloader.length;i++)
            {
                let date = parseInt(this.cardReloader[i].Month,10);
                let num = this.cardReloader[i].Spendings;
                cardDetails.splice(date-1,1,num);
            }
            console.log(cardDetails);
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
    //NewButton
    //DeleteButton
    handleDeleteUserSelected()
    {
        let selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows();
        if(selectedRows.length >0)
        {
            for(let i =0; i<selectedRows.length;i++)
            {
                deleteRecord(selectedRows[i].Id).then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record Deleted',
                            variant: 'success'
                        })
                    );
                    refreshApex(this.refreshUser);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error deleting record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
            console.log(selectedRows);
        }
        else
        {
            console.log('No Items');
        }
    }

    handleDeletePassbooksSelected()
    {
        let selectedRows = this.template.querySelector('lightning-datatable.passbooks').getSelectedRows();
        if(selectedRows.length >0)
        {
            for(let i =0; i<selectedRows.length;i++)
            {
                deleteRecord(selectedRows[i].Id).then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record Deleted',
                            variant: 'success'
                        })
                    );
                    refreshApex(this.refreshPassbooks);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error deleting record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
            console.log(selectedRows);
        }
        else
        {
            console.log('No Items');
        }
    }

    handleDeleteWalletsSelected()
    {
        let selectedRows = this.template.querySelector('lightning-datatable.wallets').getSelectedRows();
        if(selectedRows.length >0)
        {
            for(let i =0; i<selectedRows.length;i++)
            {
                deleteRecord(selectedRows[i].Id).then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record Deleted',
                            variant: 'success'
                        })
                    );
                    refreshApex(this.refreshWallets);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error deleting record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
            console.log(selectedRows);
        }
        else
        {
            console.log('No Items');
        }
    }

    handleDeletePalsSelected()
    {
        let selectedRows = this.template.querySelector('lightning-datatable.pals').getSelectedRows();
        if(selectedRows.length >0)
        {
            for(let i =0; i<selectedRows.length;i++)
            {
                deleteRecord(selectedRows[i].Id).then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record Deleted',
                            variant: 'success'
                        })
                    );
                    refreshApex(this.refreshPals);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error deleting record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
            console.log(selectedRows);
        }
        else
        {
            console.log('No Items');
        }
    }

    handleDeleteBillsSelected()
    {
        let selectedRows = this.template.querySelector('lightning-datatable.bills').getSelectedRows();
        if(selectedRows.length >0)
        {
            for(let i =0; i<selectedRows.length;i++)
            {
                deleteRecord(selectedRows[i].Id).then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record Deleted',
                            variant: 'success'
                        })
                    );
                    refreshApex(this.refreshBills);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error deleting record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
            console.log(selectedRows);
        }
        else
        {
            console.log('No Items');
        }
    }

    handleDeleteCardsSelected()
    {
        let selectedRows = this.template.querySelector('lightning-datatable.cards').getSelectedRows();
        if(selectedRows.length >0)
        {
            for(let i =0; i<selectedRows.length;i++)
            {
                deleteRecord(selectedRows[i].Id).then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record Deleted',
                            variant: 'success'
                        })
                    );
                    refreshApex(this.refreshCards);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error deleting record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
            console.log(selectedRows);
        }
        else
        {
            console.log('No Items');
        }
    }

    @track isRecordFormOpen = false;
    @track isShowDetailsOpen = false;
    @track isModalOpen = false;
    @track newApi;
    @api objectApiName;
    
    NameField = UserName;
    //rowActions
    //userFields
    uFields = [
        {
            Id: 1,
            Name: UserName},
        {
            Id: 2,
            Name: UserEmail},
        {
            Id: 3,
            Name: UserPhone},
        {
            Id: 4,
            Name: UserAccount}
        ];
    //passBookFields
    pFields =[
        {
            Id:1,
            Name: PassbookName
        },
        {
            Id:2,
            Name: PassbookExpense
        },
        {
            Id:3,
            Name: PassbookAmount
        },
        {
            Id:4,
            Name: PassbookComments
        },
        {
            Id:5,
            Name: PassbookDate
        },
        {
            Id:6,
            Name: PassbookUser
        },
    ];
    //walletFields
    wFields =[
        {
            Id: 1,
            Name: WalletBalance
        },
        {
            Id: 2,
            Name: WalletAdded
        },
        {
            Id: 3,
            Name: WalletDate
        },

    ];
    //palsFields
    palFields = [
        {
            Id: 1,
            Name: PalUser
        },
        {
            Id: 2,
            Name: PalType
        }
    ];
    //billsFields
    bFields = [
        {
            Id: 1,
            Name: BillLocation
        },
        {
            Id: 2,
            Name: BillCategory
        },
        {
            Id: 3,
            Name: BillAmount
        },
        {
            Id: 4,
            Name: BillPayBefore
        },
        {
            Id: 5,
            Name: BillForUser
        }
    ];
    //cardsFields
    cFields=[
        {
            Id: 1,
            Name: CardNumber
        },
        {
            Id: 2,
            Name: CardExpiry
        },
        {
            Id: 3,
            Name: CardCVV
        },
        {
            Id: 4,
            Name: CardName
        },
        {
            Id: 5,
            Name: CardSpendings
        }
    ];
    viewFields
    viewMode = true;
    handleUserRowActions(event)
    {
        const recId = event.detail.row;
        const actionName = event.detail.action.name;
        if(actionName === 'delete')
        {
            deleteRecord(recId.Id).then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Deleted',
                        variant: 'success'
                    })
                );
                refreshApex(this.refreshUser);
                refreshApex(this.refreshPassbooks);
                refreshApex(this.refreshWallets);
                refreshApex(this.refreshPals);
                refreshApex(this.refreshBills);
                refreshApex(this.refreshCards);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        }else 
        if(actionName === 'show_details')
        {
            
            this.recordId = recId.Id;
            this.viewFields = this.uFields;
            this.objectName = 'Users__c';
            this.isShowDetailsOpen = true;
        }else 
        if(actionName === 'passbook_details')
        {
            console.log(event.detail.row.User_Name__c);
            this.recordId = recId.Id;
            this.viewFields = this.pFields;
            this.objectName = 'Passbook__c';
            this.isShowDetailsOpen = true;
        }
        else 
        if(actionName === 'wallet_details')
        {
            this.recordId = recId.Id;
            this.viewFields = this.wFields;
            this.objectName = 'Wallet__c';
            this.isShowDetailsOpen = true;
        }
        else 
        if(actionName === 'pal_details')
        {
            this.recordId = recId.Id;
            this.viewFields = this.palFields;
            this.objectName = 'Pals__c';
            this.isShowDetailsOpen = true;
        }
        else 
        if(actionName === 'bill_details')
        {
            this.recordId = recId.Id;
            this.viewFields = this.bFields;
            this.objectName = 'Bills__c';
            this.isShowDetailsOpen = true;
        }
        else 
        if(actionName === 'card_details')
        {
            this.recordId = recId.Id;
            this.objectName = 'Cards__c';
            this.viewFields = this.cFields;
            this.isShowDetailsOpen = true;
        }
    }

    showEditForm()
    {
        this.viewMode = false;
    }
    handleRecordUpdate(event)
    {
        const fields = event.detail.fields;
        if(this.objectName === 'Users__c')
        {
            this.viewMode = true;
            this.template.querySelector('lightning-record-edit-form').submit(fields);
            this.isShowDetailsOpen = false;
            const toastEventSuccess =new ShowToastEvent({
                title: "User successfully edited!",
                variant:"success"
            })
            this.dispatchEvent(toastEventSuccess);
            refreshApex(this.refreshUser);
        }
        if(this.objectName === 'Passbook__c')
        {
            this.viewMode = true;
            this.template.querySelector('lightning-record-edit-form').submit(fields);
            this.isShowDetailsOpen = false;
            const toastEventSuccess =new ShowToastEvent({
                title: "Passbook successfully edited!",
                variant:"success"
            })
            this.dispatchEvent(toastEventSuccess);
            refreshApex(this.refreshPassbooks);
        }
        if(this.objectName === 'Wallet__c')
        {
            this.viewMode = true;
            this.template.querySelector('lightning-record-edit-form').submit(fields);
            this.isShowDetailsOpen = false;
            const toastEventSuccess =new ShowToastEvent({
                title: "Wallet successfully edited!",
                variant:"success"
            })
            this.dispatchEvent(toastEventSuccess);
            refreshApex(this.refreshWallets);
        }
        if(this.objectName === 'Pals__c')
        {
            this.viewMode = true;
            this.template.querySelector('lightning-record-edit-form').submit(fields);
            this.isShowDetailsOpen = false;
            const toastEventSuccess =new ShowToastEvent({
                title: "Pal successfully edited!",
                variant:"success"
            })
            this.dispatchEvent(toastEventSuccess);
            refreshApex(this.refreshPals);
        }
        if(this.objectName === 'Bills__c')
        {
            this.viewMode = true;
            this.template.querySelector('lightning-record-edit-form').submit(fields);
            this.isShowDetailsOpen = false;
            const toastEventSuccess =new ShowToastEvent({
                title: "Bill successfully edited!",
                variant:"success"
            })
            this.dispatchEvent(toastEventSuccess);
            refreshApex(this.refreshBills);
        }
        if(this.objectName === 'Cards__c')
        {
            this.viewMode = true;
            this.template.querySelector('lightning-record-edit-form').submit(fields);
            this.isShowDetailsOpen = false;
            const toastEventSuccess =new ShowToastEvent({
                title: "Card successfully edited!",
                variant:"success"
            })
            this.dispatchEvent(toastEventSuccess);
            refreshApex(this.refreshCards);
        }
        
        
        
        
        
        
        
    }
    Title;
    myfields;
    objectName;
    userObject = UserObject;
    passbookObject = PassbookObject;
    walletObject= WalletObject;
    palObject= PalObject;
    billObject= BillObject;
    cardObject= CardObject;
    newUser() {
        const userFormFields = [UserName,UserEmail,UserPhone,UserAccount];
        this.Title = 'New User';
        this.myfields = userFormFields;
        this.objectName = this.userObject;
        this.isModalOpen = true;
    }
    newPass()
    {
        const passbookFormFields = [PassbookName,PassbookExpense,PassbookAmount,PassbookComments,PassbookDate,PassbookUser];
        this.Title = 'New Passbook';
        this.myfields = passbookFormFields;
        this.objectName = this.passbookObject;
        this.isModalOpen = true;    
    }
    newWallet()
    {
        const walletFormFields = [WalletBalance,WalletAdded,WalletDate,WalletUser];
        this.Title = 'New Wallet';
        this.myfields = walletFormFields;
        this.objectName = this.walletObject;
        this.isModalOpen = true;    
    }
    newPal()
    {
        const palsFormFields = [PalUser,PalType];
        this.Title = 'New Pal';
        this.myfields = palsFormFields;
        this.objectName = this.palObject;
        this.isModalOpen = true;   
    }
    newBill()
    {
        const billsFormFields = [BillLocation,BillCategory,BillAmount,BillPayBefore,BillForUser];
        this.Title = 'New Bill';
        this.myfields = billsFormFields;
        this.objectName = this.billObject;
        this.isModalOpen = true;   
    }
    newCard()
    {
        const cardsFormFields = [CardNumber,CardExpiry,CardCVV,CardName,CardSpendings];
        this.Title = 'New Card';
        this.myfields = cardsFormFields;
        this.objectName = this.cardObject;
        this.isModalOpen = true;   
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.isShowDetailsOpen = false;
        this.viewMode = true;
    }
    submitDetails() {
        const toastEventSuccess =new ShowToastEvent({
            title: "Record created successfully!",
            variant:"success"
        })
        this.dispatchEvent(toastEventSuccess);
        refreshApex(this.refreshUser);
        refreshApex(this.refreshPassbooks);
        refreshApex(this.refreshWallets);
        refreshApex(this.refreshPals);
        refreshApex(this.refreshBills);
        refreshApex(this.refreshCards);
        this.isModalOpen = false;
    }

    @track customer = false;
    //CustomerORAdmin User

    renderedCallback() {
        const style = document.createElement('style');
        style.innerText = `
            lightning-tabset.tabContainer > div > lightning-tab-bar {
                --uiBgColor: #d9253e;
                --uiBgColorHover: #169BD7;
                --backgroundColor: #253B80;
                --backgroundColorActive: #169BD7;
            
                --lwc-colorBackground: var(--backgroundColor);
                --lwc-colorBackgroundAlt: var(--backgroundColorActive);
                --lwc-colorBackgroundPathIncompleteHover: var(--uiBgColorHover);
                --lwc-colorTextActionLabelActive: white;
                --lwc-colorBorder: var(--backgroundColor);
                --lwc-colorTextActionLabel: white;
                --lwc-brandTextLinkActive: white;
                --lwc-brandTextLink: white;
            }
        `;
        this.template.querySelector('lightning-tabset').appendChild(style);

        //userChart

        Promise.all([loadScript(this, chartjs)])
        .then(() => {
          const ctx = this.template.querySelector("canvas.users");
          this.chart = new window.Chart(ctx, this.userChartConfig);
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