public class PaypalDataController {
    @AuraEnabled(cacheable = true)
    public static List<Users__c> PaypalUsers() {
        Id profileId = '00e5h000000hXl3';
        if(UserInfo.getProfileId() == profileId)
        {
            return [SELECT Id,Name,User_Account__r.Name,Email__c,Mobile_Number__c FROM Users__c WHERE OwnerId =: UserInfo.getUserId()];
        }else
        {
            return [SELECT Id,Name,User_Account__r.Name,Email__c,Mobile_Number__c FROM Users__c];
        }
        
    }
    
    @AuraEnabled(cacheable = true)
    public static List<Event> GetUserActivity()
    {
        return [SELECt What.Name,Description,Owner.Name,Subject FROM Event Order By What.Name];
    }        
    
    @AuraEnabled(cacheable = true)
    public static List<Passbook__c> PassbookList()
    {
        Id profileId = '00e5h000000hXl3';
        if(UserInfo.getProfileId() == profileId)
        {
            return [SELECT Id,Name,Expense_Description__c,Amount__c,Comments__c,Date_Time__c,User__r.Name,Flagged__c FROM Passbook__c WHERE OwnerID =: UserInfo.getUserId()];
        }else
        {
            return [SELECT Id,Name,Expense_Description__c,Amount__c,Comments__c,Date_Time__c,User__r.Name,Flagged__c FROM Passbook__c];
        }
        
    }
    
    @AuraEnabled(cacheable = true)
    public static List<Wallet__c> WalletList()
    {
        Id profileId = '00e5h000000hXl3';
        if(UserInfo.getProfileId() == profileId)
        {
            return [SELECT Id,Name,Balance__c,Added_From__c,Date_Time__c FROM Wallet__c WHERE OwnerID =: UserInfo.getUserId()];
        }else
        {
            return [SELECT Id,Name,Balance__c,Added_From__c,Date_Time__c FROM Wallet__c];
        }
        
    }
    
    @AuraEnabled(cacheable = true)
    public static List<Pals__c> PalsList()
    {	
        Id profileId = '00e5h000000hXl3';
        if(UserInfo.getProfileId() == profileId)
        {
            return [SELECT Id,Name,Paypal_User__r.Name,Type__c FROM Pals__c Where OwnerId =: userinfo.getUserId()];
        }else
        {
            return [SELECT Id,Name,Paypal_User__r.Name,Type__c FROM Pals__c];
        }
        
    }
    @AuraEnabled(cacheable = true)
    public static List<Bills__c> BillList()
    {
        Id profileId = '00e5h000000hXl3';
        if(UserInfo.getProfileId() == profileId)
        {
            return [SELECT Id,Name,Location__c,Category__c,Amount__c,Offer_Applied__c,Pay_Before__c,Paid_Status__c,For_User__r.Name FROM Bills__c WHERE OwnerId =: UserInfo.getUserId()];
        }else
        {
            return [SELECT Id,Name,Location__c,Category__c,Amount__c,Offer_Applied__c,Pay_Before__c,Paid_Status__c,For_User__r.Name FROM Bills__c];
        }
        
    }
    
    @AuraEnabled(cacheable = true)
    public static List<Cards__c> CardList()
    {        
        Id profileId = '00e5h000000hXl3';
        if(UserInfo.getProfileId() == profileId)
        {
            return [SELECT Id,Name,Card_Name__r.Name,Expiry_Date__c,Card_Number__c,CVV__c,Total_Spendings__c FROM Cards__c WHERE OwnerId =: UserInfo.getUserId()];
        }else
        {
            return [SELECT Id,Name,Card_Name__r.Name,Expiry_Date__c,Card_Number__c,CVV__c,Total_Spendings__c FROM Cards__c];
        }
        
        
    }
    
    @AuraEnabled(cacheable = true)
    public static List<AggregateResult> CreatedUserMonth()
    {
        return [SELECT COUNT(Id)Name,calendar_month(CreatedDate)CreateDate FROM Users__c GROUP BY calendar_month(CreatedDate)];
    }
    
    @AuraEnabled(cacheable = true)
    public static List<AggregateResult> CreatedPassbooksPerMonth()
    {
        return [SELECT COUNT(Name) Name, calendar_month(Date_Time__c)Date_Time__c FROM Passbook__c GROUP BY calendar_month(Date_Time__c)];
    }
    
    @AuraEnabled(cacheable = true)
    public static List<AggregateResult> GetTransactionPerUser()
    {
        return [SELECT User__r.Name, COUNT(ID)Transactions  FROM Passbook__c Group By User__r.Name Order By Count(ID) Desc Limit 10];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> GetHighestTransactionPerUser()
    {
        return [SELECT Max(Amount__c)Amount,calendar_month(Date_Time__c)DateMonth FROM Passbook__c Group By calendar_month(Date_Time__c) Order By Max(AMount__c) Desc];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> GetWallets()
    {
        return [SELECT COUNT(NAME)Name,Added_From__c FROM Wallet__c GROUP BY Added_From__c];
    }
        @AuraEnabled(cacheable = true)
    public static List<AggregateResult> GetPals()
    {
        return [SELECT Count(Name)Name,Type__c FROM Pals__c Group By Type__c];
    }
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> GetBills()
    {
        return [SELECT Count(Name)Name,Category__c FROM Bills__c Group By Category__c];
    }
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> GetCards()
    {
        return [SELECT Sum(Total_Spendings__c)Spendings,calendar_month(CreatedDate)Month FROM Cards__c Group By calendar_month(CreatedDate)];
    }
    @AuraEnabled(cacheable=true)
    public static string getApiName(Id recordId){
        String sObjName = recordId.getSObjectType().getDescribe().getName();
        system.debug(sObjName);
        return sObjName;
    }
    

}