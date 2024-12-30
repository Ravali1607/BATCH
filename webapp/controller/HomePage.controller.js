sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller,JSONModel) => {
    "use strict";
    var that;
    return Controller.extend("employee.controller.HomePage", {
        onInit() {
            that=this;
            var oModel = new JSONModel({
                Employees : []
            });
            that.getView().setModel(oModel);
            var oTempModel = new JSONModel({
                tempEmp : []
            });
            that.getView().setModel(oTempModel, "oTemp");
        },
        onAddEmp: function(){
            if(!that.addDialog){
                that.addDialog = sap.ui.xmlfragment("employee.fragment.addemp",that);
            }
            that.addDialog.open();
        },
        add: function(){
            var oTempModel = that.getView().getModel("oTemp");
            var eTemp = oTempModel.getProperty("/tempEmp");
            var oData = {
                EMP_ID : sap.ui.getCore().byId("input1").getValue(),
                EMP_NAME : sap.ui.getCore().byId("input2").getValue(),
                EMP_BLODD_GRP : sap.ui.getCore().byId("input3").getValue(),
                EMP_DESIG : sap.ui.getCore().byId("input4").getValue(),
                EMP_EMAIL : sap.ui.getCore().byId("input5").getValue(),
                EMP_CONT : sap.ui.getCore().byId("input6").getValue(),
                EMP_ADDRESS : sap.ui.getCore().byId("input7").getValue(),
                EMP_BRANCH : sap.ui.getCore().byId("input8").getValue(),
            }
            eTemp.push(oData);
            oTempModel.setProperty("/tempEmp",eTemp);
            sap.m.MessageToast.show("Employee Data added successfully..!");
            that.resetEmp();
        },
        SaveEmp: function(){
            
        },
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
        closeEmp:function(){
            that.addDialog.close();
        },
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
        }
    });
});