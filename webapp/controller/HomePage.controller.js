sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], (Controller,JSONModel,Fragment,Filter,FilterOperator) => {
    "use strict";
    var that;
    return Controller.extend("employee.controller.HomePage", {
        onInit() {
            that=this;
            // var oModel = new JSONModel({
            //     Employees : []
            // });
            // that.getView().setModel(oModel);
            var oDataModel = this.getOwnerComponent().getModel();
            oDataModel.read("/EMPLOYEE", {
                success: function (oData) {
                    var uniqueDesignations = that.UniqueDesignations(oData.results);
                    var uniqueBranch = that.UniqueBranch(oData.results);
                    var uniqueBloodGrp = that.UniqueBloodGrp(oData.results);
                    var designationModel = new JSONModel({
                        DESIGNATIONS: uniqueDesignations,
                        BRANCH : uniqueBranch,
                        BLOODGROUP : uniqueBloodGrp
                    });
                    that.getView().setModel(designationModel, "designations");
                    that.getView().setModel(designationModel,"branch");
                    that.getView().setModel(designationModel,"bloodgroup");
                },error: function (error) {
                    console.log(error);
                }
            });
            // var oModel = that.getOwnerComponent().getModel();
            // that.getView().setModel(oModel);
            var oTempModel = new JSONModel({
                tempEmployees : []
            });
            that.getView().setModel(oTempModel, "TemporaryModel");
        },
        UniqueDesignations: function (employeeData) {
            var uniqueDesignations = [];
            employeeData.forEach(function (employee) {
                if (!uniqueDesignations.includes(employee.EMP_DESIG)) {
                    uniqueDesignations.push(employee.EMP_DESIG);
                }
            });
            return uniqueDesignations;
        },
        UniqueBranch : function(employeeData){
            var uniqueBranch = [];
            employeeData.forEach(function (employee) {
                if (!uniqueBranch.includes(employee.EMP_BRANCH)) {
                    uniqueBranch.push(employee.EMP_BRANCH);
                }
            });
            return uniqueBranch;
        },
        UniqueBloodGrp : function(employeeData){
            var uniqueBloodGrp = [];
            employeeData.forEach(function (employee) {
                if (!uniqueBloodGrp.includes(employee.EMP_BLODD_GRP)) {
                    uniqueBloodGrp.push(employee.EMP_BLODD_GRP);
                }
            });
            return uniqueBloodGrp;
        },
        onAddEmp: function(){
            if(!that.addDialog){
                that.addDialog = sap.ui.xmlfragment("employee.fragment.addemp",that);
            }
            that.addDialog.open();
            var oTempModel = that.getView().getModel("TemporaryModel");
            oTempModel.setProperty("/tempEmployees", []);
        },
        // <!-------- storing multiple records in the array ----------!>
        add: function(){
            var oTempModel = that.getView().getModel("TemporaryModel");
            var eTemporary = oTempModel.getProperty("/tempEmployees");
                var oNewEmp = {
                    EMP_ID : sap.ui.getCore().byId("input1").getValue(),
                    EMP_NAME : sap.ui.getCore().byId("input2").getValue(),
                    EMP_BLODD_GRP : sap.ui.getCore().byId("input3").getValue(),
                    EMP_DESIG : sap.ui.getCore().byId("input4").getValue(),
                    EMP_EMAIL : sap.ui.getCore().byId("input5").getValue(),
                    EMP_CONT : sap.ui.getCore().byId("input6").getValue(),
                    EMP_ADDRESS : sap.ui.getCore().byId("input7").getValue(),
                    EMP_BRANCH : sap.ui.getCore().byId("input8").getValue(),
                }
                console.log(oNewEmp);
                if(oNewEmp.EMP_ID && oNewEmp.EMP_NAME && oNewEmp.EMP_BLODD_GRP && oNewEmp.EMP_DESIG && oNewEmp.EMP_EMAIL && oNewEmp.EMP_CONT && oNewEmp.EMP_ADDRESS && oNewEmp.EMP_BRANCH){
                    eTemporary.push(oNewEmp);
                    console.log(eTemporary);
                    oTempModel.setProperty("/tempEmployees",eTemporary);
                    that.resetEmp();
                    var addTable = sap.ui.getCore().byId("addTable");
                    addTable.setModel(oTempModel);
                }
                else{
                    sap.m.MessageToast.show("Please fill all the fields");
                }
        },
        // <!----------- storing data into the view table ------------!>
        SaveEmp: function(){
            that.add();
            var oTempModel = that.getView().getModel("TemporaryModel");
            var eTemporary = oTempModel.getProperty("/tempEmployees");
            var oModel = that.getView().getModel();
            // var aEmployees = oModel.getProperty("/Employees");
            // aEmployees = aEmployees.concat(eTemporary);
            // oModel.setProperty("/Employees",aEmployees);
            for(var i=0; i<eTemporary.length; i++){
                var emp = eTemporary[i];
                var e = {
                    EMP_ID : emp.EMP_ID,
                    EMP_NAME : emp.EMP_NAME,
                    EMP_BLODD_GRP : emp.EMP_BLODD_GRP,
                    EMP_DESIG : emp.EMP_DESIG,
                    EMP_EMAIL : emp.EMP_EMAIL,
                    EMP_CONT : emp.EMP_CONT,
                    EMP_ADDRESS : emp.EMP_ADDRESS,
                    EMP_BRANCH : emp.EMP_BRANCH, 
                }
                oModel.create("/EMPLOYEE",e,{
                    success : function(response){
                        that.getOwnerComponent().getModel();
                        sap.m.MessageToast.show("Employee Data added successfully...!");
                        console.log("success");
                    },error: function(error){
                        console.log(error);
                    }
                })
            }
            that.addDialog.close();
            oTempModel.setProperty("/tempEmployees", []);
        },
        // <!------------------- delete single employee in the fragment table ------------------!>
        deleteTemp: function(oEvent){
            var oTempModel = that.getView().getModel("TemporaryModel");
            var eTemporary = oTempModel.getProperty("/tempEmployees");
            var oContext = oEvent.getSource().getBindingContext().getObject();
            var iIndex = eTemporary.findIndex(employee => employee.EMP_ID === oContext.EMP_ID);  
            if (iIndex !== -1) {
                sap.m.MessageBox.confirm("Are you sure you want to delete this record?", {
                    title: "Confirm",
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.OK) {
                            eTemporary.splice(iIndex, 1);  
                            oTempModel.setProperty("/tempEmployees", eTemporary);  
                            sap.m.MessageToast.show("Record deleted successfully!"); 
                        }
                    }
                });
            } else {
                sap.m.MessageToast.show("Record not found!");
            }
        },
        // <!---------  reset the input fields in the fragment  ----------!>
        resetEmp: function(){
            sap.ui.getCore().byId("input1").setValue("");
            sap.ui.getCore().byId("input2").setValue("");
            sap.ui.getCore().byId("input3").setValue("");
            sap.ui.getCore().byId("input4").setValue("");
            sap.ui.getCore().byId("input5").setValue("");
            sap.ui.getCore().byId("input6").setValue("");
            sap.ui.getCore().byId("input7").setValue("");
            sap.ui.getCore().byId("input8").setValue("");
        },
        // <!---------  closing the fragment 1 (add fragment) ----------!>
        closeEmp:function(){
            that.addDialog.close();
        },
        // <!--------- updating multiple employees ----------!>
        onUpdateEmp: function(){
            var oTempModel = that.getView().getModel("TemporaryModel");
            var eTemporary = oTempModel.getProperty("/tempEmployees");
            var oTable = that.getView().byId("empTable");
            var oSelectedItem = oTable.getSelectedItems();
            var eTemporary = [];
            if(oSelectedItem == 0){
                sap.m.MessageToast.show("Select an employee to modify employee information");
            }else{
            for(var i=0; i < oSelectedItem.length; i++){        
                var item = oSelectedItem[i];
                var oEmp = item.getBindingContext().getObject();
                eTemporary.push(oEmp);
                oTempModel.setProperty("/tempEmployees",eTemporary);
                console.log(eTemporary);                                                //storing the selected details into the array
                }
                if(!that.updateDialog){
                    that.updateDialog = sap.ui.xmlfragment("employee.fragment.updateemp",that);
                    that.getView().addDependent(that.updateDialog);
                }
                that.updateDialog.open();
                var updateTable = sap.ui.getCore().byId("updateTable");     
                updateTable.setModel(oTempModel);                                        //binding data into the fragment 
            }                                     
        },
        saveUpdate:function(){
            var oTempModel = that.getView().getModel("TemporaryModel");
            var eTemporary = oTempModel.getProperty("/tempEmployees");
            var oModel = that.getView().getModel();
            for(var i=0; i<eTemporary.length; i++){
                var emp = eTemporary[i];
                var e = {
                    EMP_ID : emp.EMP_ID,
                    EMP_NAME : emp.EMP_NAME,
                    EMP_BLODD_GRP : emp.EMP_BLODD_GRP,
                    EMP_DESIG : emp.EMP_DESIG,
                    EMP_EMAIL : emp.EMP_EMAIL,
                    EMP_CONT : emp.EMP_CONT,
                    EMP_ADDRESS : emp.EMP_ADDRESS,
                    EMP_BRANCH : emp.EMP_BRANCH, 
                }                                                                          //storing the updated details
                var updatePath = `/EMPLOYEE('${e.EMP_ID}')`
                oModel.update(updatePath,e,{
                    success: function(response){
                        sap.m.MessageToast.show("Employee Information updated successfully..!");            //displaying the updated values in the view table
                    },error: function(error){
                        console.log(error);
                        sap.m.MessageToast.show("Error while updating the details");
                    }
                })
            }
            that.updateDialog.close();
        },
        // <!------------------ closing fragment 2 --------------------!>
        closeUpdate:function(){
            that.updateDialog.close();
        },
         // <!------- Deleting multiple employees --------------!>
         onDeleteEmp1: function(){
            var oTable = that.getView().byId("empTable");
            var oSelectedItem = oTable.getSelectedItems();
            var oModel = that.getOwnerComponent().getModel();
            if(oSelectedItem == 0){
                sap.m.MessageToast.show("No employee is selected");
            }else{
            for(var i=0; i < oSelectedItem.length; i++){
                    var item = oSelectedItem[i];
                    var oEmployeeData = item.getBindingContext().getObject();               //storing the selected employee details into oEmployeeData
                    var deletePath = `/EMPLOYEE('${oEmployeeData.EMP_ID}')`                 //fetching the employee id
                    oModel.remove(deletePath,{
                        success: function(){
                            sap.m.MessageToast.show("Employee Details deleted successfully..!")
                            console.log("success");
                        },error: function(error){
                            console.log(error);
                        }
                    })
                }
            }
        },
        // <!---------------- Search Field -------------------!>
        searchName: function(oEvent){
            var aFilter = [];
            var oSearch = oEvent.getSource().getValue();
            // if (oSearch) {                                                                                   
            //     aFilter.push(new Filter("EMP_NAME", FilterOperator.Contains, oSearch));                          //search using name 
            // }
            // if (oSearch) {
            //     aFilter.push(new Filter({
			// 		path: "EMP_NAME",
			// 		operator: FilterOperator.Contains,
			// 		value1: oSearch,
			// 		caseSensitive: false
			// 	}));
                    aFilter.push(new Filter({                                                           //search using name or id or designation
                        filters: [
                          new Filter({
                            path: 'EMP_DESIG',
                            operator: FilterOperator.Contains,
                            value1: oSearch,
                            caseSensitive : false
                          }),
                          new Filter({
                            path: 'EMP_NAME',
                            operator: FilterOperator.Contains,
                            value1: oSearch,
                            caseSensitive : false
                          }),
                          new Filter({
                            path : 'EMP_ID',
                            operator: FilterOperator.Contains,
                            value1: oSearch,
                            caseSensitive: false
                          })
                        ],
            }));
            var oList = that.getView().byId("empTable");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
        // <!------------------ COMBO BOX ON DESIGNATION, BRANCH AND BLOOD GROUP ----------------------!>
        ComboBox: function(){
            var oCombo = [];
            var oSelectedDesKey = that.byId("comboBoxDes").getSelectedKey();
            var oSelectedKeyBranch = that.byId("comboBoxBranch").getSelectedKey();
            var oSelectedKeyGrp = that.byId("comboBoxBloodGrp").getSelectedKey();
            // var oSelectedItem = that.byId("comboBox1").getSelectedItem();
            if(oSelectedDesKey){                                                            //SINGLE SELECTION
                oCombo.push(new Filter({
                    path : "EMP_DESIG",
                    operator : FilterOperator.EQ,
                    value1 : oSelectedDesKey
                }));
            }
            if(oSelectedKeyBranch){
                oCombo.push(new Filter({
                    path : "EMP_BRANCH",
                    operator : FilterOperator.EQ,
                    value1 : oSelectedKeyBranch
                }));
            }
            if(oSelectedKeyGrp){
                oCombo.push(new Filter({
                    path : "EMP_BLODD_GRP",
                    operator : FilterOperator.EQ,
                    value1 : oSelectedKeyGrp
                }));
            }
            if(oSelectedDesKey && oSelectedKeyBranch){                                        //DOUBLE SELECTION
                oCombo.push(new Filter({
                        filters: [
                          new Filter({
                            path: 'EMP_DESIG',
                            operator: FilterOperator.EQ,
                            value1: oSelectedDesKey
                          }),
                          new Filter({
                            path: 'EMP_BRANCH',
                            operator: FilterOperator.EQ,
                            value1: oSelectedKeyBranch
                          })
                        ],
                        and: true
                }))
            }
            if(oSelectedDesKey && oSelectedKeyGrp){
                oCombo.push(new Filter({
                        filters: [
                          new Filter({
                            path: 'EMP_DESIG',
                            operator: FilterOperator.EQ,
                            value1: oSelectedDesKey
                          }),
                          new Filter({
                            path: 'EMP_BLODD_GRP',
                            operator: FilterOperator.EQ,
                            value1: oSelectedKeyGrp
                          })
                        ],
                        and: true
                }))
            }
            if(oSelectedKeyBranch && oSelectedKeyGrp){
                oCombo.push(new Filter({
                        filters: [
                          new Filter({
                            path: 'EMP_BRANCH',
                            operator: FilterOperator.EQ,
                            value1: oSelectedKeyBranch
                          }),
                          new Filter({
                            path: 'EMP_BLODD_GRP',
                            operator: FilterOperator.EQ,
                            value1: oSelectedKeyGrp
                          })
                        ],
                        and: true
                }))
            }
            if(oSelectedDesKey && oSelectedKeyBranch && oSelectedKeyGrp){                   //TRIPLE SELECTION
                oCombo.push(new Filter({
                        filters: [
                          new Filter({
                            path: 'EMP_DESIG',
                            operator: FilterOperator.EQ,
                            value1: oSelectedDesKey
                          }),
                          new Filter({
                            path: 'EMP_BRANCH',
                            operator: FilterOperator.EQ,
                            value1: oSelectedKeyBranch
                          }),
                          new Filter({
                            path: 'EMP_BLODD_GRP',
                            operator: FilterOperator.EQ,
                            value1: oSelectedKeyGrp
                          })
                        ],
                        and: true
                      }))
            }
            var oTable = that.getView().byId("empTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oCombo);
        },
        // <!------------- deleting single record -------------!>
        // onDeleteEmp: function(oEvent){
        //     var oButton = oEvent.getSource();
        //     var oContext = oButton.getBindingContext();
        //     var oModel = that.getOwnerComponent().getModel();
        //     var sPath = oContext.getPath();
        //     oModel.remove(sPath,{
        //         success:function()
        //         {
        //              sap.m.MessageToast.show("Employee Deleted");
        //         },
        //         error:function(error)
        //         {
        //             console.log(error)
        //             sap.m.MessageToast.show("Error");
        //         }
        //     })
        // },
        // <----------- Updating a single Employee Information ---------->
        // onUpdateEmp:function(){
        //     var oTable = that.byId("empTable");
        //     var oSelectedItem = oTable.getSelectedItem();
        //     var oContext = oSelectedItem.getBindingContext();
        //     var oEmployeeData = oContext.getObject();
        //     if(!that.updateDialog){
        //         that.updateDialog = sap.ui.xmlfragment("employee.fragment.updateemp",that);
        //     }
        //     that.updateDialog.open();
        //     var oModel = new JSONModel(oEmployeeData);
        //     that.updateDialog.setModel(oModel);
        // },
        // closeEmp1: function(){
        //     that.updateDialog.close();
        // },
        // onUpdate: function(){
        //     var updateEmp = {
        //         EMP_ID :sap.ui.getCore().byId("updateinput1").getValue(),
        //         EMP_NAME : sap.ui.getCore().byId("updateinput2").getValue(),
        //         EMP_BLODD_GRP : sap.ui.getCore().byId("updateinput3").getValue(),
        //         EMP_DESIG : sap.ui.getCore().byId("updateinput4").getValue(),
        //         EMP_EMAIL : sap.ui.getCore().byId("updateinput5").getValue(),
        //         EMP_CONT : sap.ui.getCore().byId("updateinput6").getValue(),
        //         EMP_ADDRESS : sap.ui.getCore().byId("updateinput7").getValue(),
        //         EMP_BRANCH : sap.ui.getCore().byId("updateinput8").getValue(),
        //     }
            
        //     var oData = that.getOwnerComponent().getModel();
        //     var updatePath = `/EMPLOYEE('${updateEmp.EMP_ID}')`
        //     oData.update(updatePath, updateEmp,{
        //         success: function (response) {
        //             console.log(response);
        //             sap.m.MessageToast.show("Employee Data updated");
        //         },error: function (error) {
        //             console.log(error)
        //             sap.m.MessageToast.show("Error while updating the data");
        //         }
        //     })
        //     that.updateDialog.close();
        // }
    });
});