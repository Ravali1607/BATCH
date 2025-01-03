sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
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
            var oModel = that.getOwnerComponent().getModel();
            that.getView().setModel(oModel);
            var oTempModel = new JSONModel({
                tempEmployees : []
            });
            that.getView().setModel(oTempModel, "TemporaryModel");
        },
        onAddEmp: function(){
            if(!that.addDialog){
                that.addDialog = sap.ui.xmlfragment("employee.fragment.addemp",that);
            }
            that.addDialog.open();
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
            eTemporary.push(oNewEmp);
            console.log(eTemporary);
            oTempModel.setProperty("/tempEmployees",eTemporary);
            that.resetEmp();
            var addTable = sap.ui.getCore().byId("addTable");
            addTable.setModel(oTempModel);
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
                        console.log("success");
                    },error: function(error){
                        console.log(error);
                    }
                })
            }
            that.addDialog.close();
            oTempModel.setProperty("/tempEmployees", []);
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
        // <!------------- deleting single record -------------!>
        onDeleteEmp: function(oEvent){
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();
            var oModel = that.getOwnerComponent().getModel();
            var sPath = oContext.getPath();
            oModel.remove(sPath,{
                success:function()
                {
                     sap.m.MessageToast.show("Employee Deleted");
                },
                error:function(error)
                {
                    console.log(error)
                    sap.m.MessageToast.show("Error");
                }
            })
        },
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
        // <!--------- updating multiple employees ----------!>
        onUpdateEmp: function(){
            var oTempModel = that.getView().getModel("TemporaryModel");
            var eTemporary = oTempModel.getProperty("/tempEmployees");
            var oTable = that.getView().byId("empTable");
            var oSelectedItem = oTable.getSelectedItems();
            
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
            var updateTable = sap.ui.getCore().byId("updateTable");     
            updateTable.setModel(oTempModel);                                           //binding data into the fragment 
            that.updateDialog.open();
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
         // <!------- Deleting multiple employees --------------!>
         onDeleteEmp1: function(){
            var oTable = that.getView().byId("empTable");
            var oSelectedItem = oTable.getSelectedItems();
            var oModel = that.getOwnerComponent().getModel();
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
        },
        // <!---------------- Search Field -------------------!>
        searchName: function(oEvent){
            var aFilter = [];
            var oSearch = oEvent.getSource().getValue();
            // if (oSearch) {
            //     aFilter.push(new Filter("EMP_NAME", FilterOperator.Contains, oSearch));
            // }
            if (oSearch) {
                aFilter.push(new Filter({
					path: "EMP_NAME",
					operator: FilterOperator.Contains,
					value1: oSearch,
					caseSensitive: false
				}));
            }
            var oList = that.getView().byId("empTable");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
            // var oModel = that.getOwnerComponent().getModel();
            // oModel.read("/EMPLOYEE",{
            //     success : function(response){
                    // var filteredNames = response.results.filter(name => name.EMP_NAME === oSearch)
                    // var oFilteredModel = new sap.ui.model.json.JSONModel({
                    //     items: filteredNames
                    // });
                    
                // },error: function(error){
                //     console.log(error);
                // }
        },
        // <!------------------ COMBO BOX ON DESIGNATION ----------------------!>
        onDesignation: function(){
            var oDes = [];
            var oSelectedKey = that.byId("comboBox1").getSelectedKey();
            var oSelectedItem = that.byId("comboBox1").getSelectedItem();
            if(oSelectedItem){
                oDes.push(new Filter({
                    path : "EMP_ID",
                    operator : FilterOperator.EQ,
                    value1 : oSelectedKey
                }));
            }
            var oTable = that.getView().byId("empTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oDes);
        },
        onBranch: function(){
            var oBranch = [];
            var oSelectedKey = that.byId("comboBox2").getSelectedKey();
            if(oSelectedKey){
                oBranch.push(new Filter({
                    path : "EMP_ID",
                    operator : FilterOperator.Contains,
                    value1 : oSelectedKey
                }));
            }
            var oTable = that.getView().byId("empTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oBranch);
        },
        onBloodGrp: function(){
            var oBloodGrp = [];
            var oSelectedKey = that.byId("comboBox3").getSelectedKey();
            if(oSelectedKey){
                oBloodGrp.push(new Filter({
                    path : "EMP_ID",
                    operator : FilterOperator.Contains,
                    value1 : oSelectedKey
                }));
            }
            var oTable = that.getView().byId("empTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oBloodGrp);
        },
    });
});