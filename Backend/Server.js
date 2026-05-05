approver_List = List();
amount = input.New_PO_Value_Excld_GST;
category = input.PO_Category;
// General Category
if(category == "General")
{
	if(amount <= 500000)
	{
		approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		//GM
	}
	else if(amount <= 1000000)
	{
		approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		// GM
		approver_List.add("prateek.sachdeva@unisparkinnovation.com");
		// VP
	}
	else if(amount <= 2500000)
	{
		approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		//GM
		approver_List.add("prateek.sachdeva@unisparkinnovation.com");
		//VP
		approver_List.add("vishvesh@unisparkinnovation.com");
		// CXO
	}
	else if(amount <= 500000)
	{
		approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		//GM
		approver_List.add("prateek.sachdeva@unisparkinnovation.com");
		//VP
		approver_List.add("vishvesh@unisparkinnovation.com");
		// CXO
		approver_List.add("prabhat@unisparkinnovation.com");
		// EVP
	}
	else if(category== "Asset" || category== "Expense"){
		// For Asset Logic
		if(category== "Asset"){
			if(amount>500000){
		approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		//GM
		approver_List.add("prateek.sachdeva@unisparkinnovation.com");
		//AVP
		approver_List.add("vishvesh@unisparkinnovation.com");
		// CXO
		approver_List.add("prabhat@unisparkinnovation.com");
		// EVP
		approver_List.add("animesh@unisparkinnovation.com");
		// MD
			}
			else if(amount>100000){ //1-5 lakh
		approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		//GM
		approver_List.add("prateek.sachdeva@unisparkinnovation.com");
		//AVP
		approver_List.add("vishvesh@unisparkinnovation.com");
		// CXO
		approver_List.add("prabhat@unisparkinnovation.com");
		// EVP
			}
			else if(amount == 100000){
		approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		//GM
		approver_List.add("prateek.sachdeva@unisparkinnovation.com");
		//AVP
		approver_List.add("vishvesh@unisparkinnovation.com");
		// CXO
			}
			else { // 0
		approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		//GM
		approver_List.add("prateek.sachdeva@unisparkinnovation.com");
		//AVP
			}
		}

        // For Expense Logic
        else if(category== "Expense"){
            if(amount> 100000){
                approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		        //GM
		        approver_List.add("prateek.sachdeva@unisparkinnovation.com");
		        //AVP
		        approver_List.add("vishvesh@unisparkinnovation.com");
		        // CXO
		        approver_List.add("prabhat@unisparkinnovation.com");
		        // EVP
		        approver_List.add("animesh@unisparkinnovation.com");
		        // MD
            }
            else if(amount== 100000){
                approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		        //GM
		        approver_List.add("prateek.sachdeva@unisparkinnovation.com");
		        //AVP
		        approver_List.add("vishvesh@unisparkinnovation.com");
		        // CXO
            }
            else{
                approver_List.add("ramandeep.kaur@unisparkinnovation.com");
		        //GM
		        approver_List.add("prateek.sachdeva@unisparkinnovation.com");
		        //AVP
            }
        }
	}
}
else
{
	// 50 lakh + Approval
	approver_List.add("ramandeep.kaur@unisparkinnovation.com");
	//GM
	approver_List.add("prateek.sachdeva@unisparkinnovation.com");
	//VP
	approver_List.add("vishvesh@unisparkinnovation.com");
	// CXO
	approver_List.add("prabhat@unisparkinnovation.com");
	// EVP
	approver_List.add("Animesh@unisparkinnovation.com");
	// MD
}
// Full list store
input.Approver_List = approver_List.toString();
// Start Level 
input.Approval_Level = 0;
// First Approver assign
input.Next_Approver = approver_List.get(0);
// Status set
input.Approval_Status = "Pending Approval";
// Email Send logic
sendmail
[
	from :zoho.adminuserid
	to :input.Next_Approver
	subject :"PO Approval Required"
	message :"Please approve the PO. Click below link"
]
