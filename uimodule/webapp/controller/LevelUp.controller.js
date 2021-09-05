sap.ui.define([
    "de/christopherpielka/DSACharTool/controller/BaseController",
    "sap/m/ValueColor",
    'sap/ui/model/json/JSONModel'
  ], function(Controller, ValueColor, JSONModel) {
    "use strict";
  
    return Controller.extend("de.christopherpielka.DSACharTool.controller.LevelUp", {

        /** Helper functions */
        updateSums : function () {

          var iDice1 = parseInt(this._oRoll1Tile.getValue());
          var iDice2 = parseInt(this._oRoll2Tile.getValue());
          var iDice3 = parseInt(this._oRoll3Tile.getValue());

          var iSum2 = iDice1 + iDice2;
          var iSum3 = iDice1 + iDice2 + iDice3;

          this._oRollSum2Tile.setValue(iSum2);
          this._oRollSum3Tile.setValue(iSum3);
        }, 

        updateRoll1Tile : function(iRollValue) {
          this._oRoll1Tile.setValue(iRollValue);
        },

        updateRoll2Tile : function(iRollValue) {
          this._oRoll2Tile.setValue(iRollValue);
        },

        updateRoll3Tile : function(iRollValue) {
          this._oRoll3Tile.setValue(iRollValue);
        },

        updateTriesInput : function(iOffset) {
          this._oTriesInput.setValue(parseInt(this._oTriesInput.getValue()) + iOffset)
        },

        resetTriesInput : function() {
          this._oTriesInput.setValue(0);
        },

        getRandomNum : function(iMin, iMax) {
          return Math.floor(Math.random() * (iMax - iMin + 1) + iMin)
        },

        updateDiceValueColor : function(oTile) {
          var iValue = parseInt(oTile.getValue());
          if (iValue == this.MAX_ROLL) {
            oTile.setValueColor(ValueColor.Good);
          } else if (iValue == this.MIN_ROLL){
            oTile.setValueColor(ValueColor.Error);
          } else {
            oTile.setValueColor(ValueColor.None);
          }
        },

        updateSumValueColor : function(oTile, iMin, iMax) {
          var iValue = parseInt(oTile.getValue());
          if (iValue == iMax) {
            oTile.setValueColor(ValueColor.Good);
          } else if (iValue == iMin){
            oTile.setValueColor(ValueColor.Error);
          } else {
            oTile.setValueColor(ValueColor.None);
          }
        },

        updateValueColors : function() {
            //Tries
            var iValue = parseInt(this._oTriesInput.getValue());
            if (iValue < this.MAX_TRIES) {
              this._oTriesInput.setValueColor(ValueColor.Good);
            } else {
              this._oTriesInput.setValueColor(ValueColor.Error);
            }

            //Dice
            this.updateDiceValueColor(this._oRoll1Tile);
            this.updateDiceValueColor(this._oRoll2Tile);
            this.updateDiceValueColor(this._oRoll3Tile);

            //Sums
            this.updateSumValueColor(this._oRollSum2Tile, 2, 12);
            this.updateSumValueColor(this._oRollSum3Tile, 3, 18);

        },

        addCurrentRollToTable : function() {
          var aRolls = this.getModel().getProperty("/rolls");
          var oNewRoll = {
            rollTries : parseInt(this._oTriesInput.getValue()),
            dice1 : parseInt(this._oRoll1Tile.getValue()),
            dice2 : parseInt(this._oRoll2Tile.getValue()),
            dice3 : parseInt(this._oRoll3Tile.getValue()),
            sum2 : parseInt(this._oRollSum2Tile.getValue()),
            sum3 : parseInt(this._oRollSum3Tile.getValue()),
          };

          aRolls.splice(0, 0, oNewRoll);

          this.getModel().setProperty("/rolls", aRolls);
        },

        /** UI functions */
        onInit : function () {
          this.MAX_TRIES = 35;
          this.MIN_ROLL = 1;
          this.MAX_ROLL = 6;

          var oTableModel = new JSONModel({"rolls": []});
          this.getView().setModel(oTableModel);

          this._oRoll1Tile = sap.ui.getCore().byId("__xmlview0--roll1");
          this._oRoll2Tile = sap.ui.getCore().byId("__xmlview0--roll2");
          this._oRoll3Tile = sap.ui.getCore().byId("__xmlview0--roll3");
          this._oRollSum2Tile = sap.ui.getCore().byId("__xmlview0--rollSum2");
          this._oRollSum3Tile = sap.ui.getCore().byId("__xmlview0--rollSum3");
          this._oTriesInput = sap.ui.getCore().byId("__xmlview0--tries");

          this.updateValueColors();
        },

        onAfterRendering: function() {
          $(this._oTriesInput.getDomRef()).on('contextmenu', function(){
            this.updateTriesInput(-1);
            return false;
          }.bind(this));
        },

        onRoll : function () {

            var iRoll1 = this.getRandomNum(1,6);
            var iRoll2 = this.getRandomNum(1,6);
            var iRoll3 = this.getRandomNum(1,6);

            this.updateTriesInput(1);
            this.updateRoll1Tile(iRoll1);
            this.updateRoll2Tile(iRoll2);
            this.updateRoll3Tile(iRoll3);

            this.updateSums();
            this.updateValueColors();
            this.addCurrentRollToTable();
        },

        onReset : function () {
            var triesInput = sap.ui.getCore().byId("__xmlview0--tries");
            triesInput.setValue(0);
            this.updateRoll1Tile(1);
            this.updateRoll2Tile(1);
            this.updateRoll3Tile(1);

            this.updateSums();
            this.updateValueColors();
        },

        onReroll1 : function () {
          var iRoll = this.getRandomNum(1,6);
          this.updateRoll1Tile(iRoll);
          this.updateValueColors();
          this.addCurrentRollToTable();
        }, 
        
        onReroll2 : function () {
          var iRoll = this.getRandomNum(1,6);
          this.updateRoll2Tile(iRoll);
          this.updateValueColors();
          this.addCurrentRollToTable();
        },

        onReroll3 : function() {
          var iRoll = this.getRandomNum(1,6);
          this.updateRoll3Tile(iRoll);
          this.updateValueColors();
          this.addCurrentRollToTable();
        },

        onAddTry : function() {
          this.updateTriesInput(1);
        }
    });
  });
  