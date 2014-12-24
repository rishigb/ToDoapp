/****************App by RISHI GAURAV BHATNAGAR*******************/

// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);
//This part is working
// Cordova is ready
var db=""; // Put it here so that this becomes global

/**********************************************************************************************Functions used in the code ****************************************************************************************************/
function onDeviceReady() {
    //this part is also working
    // alert(db);
    db = window.sqlitePlugin.openDatabase({
        name: "2du.db"
    });
    //alert(db);

    //
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key autoincrement, note text, flag_val integer)'); // Simply creating the table NOT NULL was the earlier issue.

        tx.executeSql("DELETE FROM test_table WHERE flag_val = ?", [-1], function (tx, res) {
            console.log("insertId: " + res.insertId);
            //alert("insertId: " + res.insertId + " -- probably 1");
            console.log("rowsAffected: " + res.rowsAffected);
            //alert("rowsAffected: " + res.rowsAffected + " -- should be 1");

        }, function (e) {
            console.log("ERROR: " + e.message);
        });
    });
}

function recoverTable(){
    db.transaction(function (tx) { //Need this function to work with the SQLIte command as seen above.Create a generic one line statment for this
        tx.executeSql("SELECT note FROM test_table WHERE flag_val = ?", [-1], function (tx, res) { 
               for (i = 0; i < res.rows.length; i++) {

                document.getElementById("container").innerHTML += "<div><li>" + res.rows.item(i).note.replace("'","") + "</li></div>";// Replace the quotes with blank
            }
        });
    }, function (e) {
        console.log("ERROR: " + e.message);
    });

}


function insertintoTable(inpvalue1, inpvalue2) {

    db.transaction(function (tx) { //Need this function to work with the SQLIte command as seen above.Create a generic one line statment for this
        tx.executeSql("INSERT INTO test_table (note, flag_val) VALUES (?,?)", [inpvalue1, inpvalue2], function (tx, res) { //[inpvalue1,inpvalue2] is to comply with sql injection precautions in the earlier code.
            console.log("insertId: " + res.insertId + " -- probably 1");
            //alert("insertId: " + res.insertId + " -- probably 1");
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
            //alert("rowsAffected: " + res.rowsAffected + " -- should be 1");
        });
    }, function (e) {
        console.log("ERROR: " + e.message);
    });
}

function updatevalTable(inpvalue1, flag_valtobe) {
    db.transaction(function (tx) {
        tx.executeSql("UPDATE test_table SET flag_val = ? WHERE note = ? ", [flag_valtobe, inpvalue1], function (tx, res) {
            console.log("insertId: " + res.insertId);
            console.log("rowsAffected: " + res.rowsAffected);
            //alert("rowsAffected: " + res.rowsAffected + " -- should be 1");
        });
    }, function (e) {
        console.log("ERROR: " + e.message);
    });
}



/**********************************************************************************************Functions used in the code ****************************************************************************************************/

$(document).ready(function () {
    var conlenght =$(".container").text().length;
    
  /*  if ( conlenght == 111) { //When app opens , only 111 is present, which means, recovery is required. Ashte!
        setTimeout(function(){recoverTable();},5000); // this is not a proper method. Waits long enough to load the db.
    } */
    $('#sec2').hide();
    $('#sec3').hide();
    $('#sec4').hide();
    $('.ui-loader').hide();
    $('#view').click(function () {
        //hide section 1
        //scroll to section 2
        $('#sec1').slideToggle();
        $('#sec2').slideToggle();
    });






    $('#add').click(function () {
        var note;
        //hide section1
        $('#sec1').slideToggle();
        //prompt for the value
        setTimeout(function () {
            note = prompt("Enter the note");
            if (note.length > 0) { //Save this is note if this is not null
                document.getElementById("container").innerHTML += "<div><li>" + note + "</li></div>";
                //Insert Value in the table
                var stringinp = "'" + note + "'";
                insertintoTable(stringinp, 0);

            } else {
                alert("Value not entered");
            };
        }, 500);


        //show section 2
        $('#sec2').slideToggle();

    });




    $('#add1').click(function () {
        var note = prompt("Enter the note");
        if (note.length > 0) {
            document.getElementById("container").innerHTML += "<div><li>" + note + "</li></div>";
            var stringinp = "'" + note + "'";
            insertintoTable(stringinp, 0);
        } else {
            alert("Value not entered");
        }


    });




    $('#backButton').click(function () {
        $('#sec2').slideToggle();
        $('#sec1').slideToggle();
    });



    $('.container').on("swiperight", 'div', function () { //dynamic binding being done with the parent here.
        $(this).remove();
        //Delete
        var delval = "'" + $(this).text() + "'";
        alert(delval);
        updatevalTable(delval, -1);

    });



    $('.container').on("swipeleft", 'div li', function () {
        //alert("its coming to this point"); //dynamic binding being done with the parent here.
        $(this).css("text-decoration", "line-through");
        //strikeout
        //Flag_val should be made 1 here 
        //alert($(this).text()); // This gives the value in the text 
        var upval = "'" + $(this).text() + "'";
        updatevalTable(upval, 1);


    });
    
    $('#recover').click(function(){
        
    recoverTable();
    
    });

});



/********************************************************Sample code for SQLIte ***********************************************************************************************************************************************
// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
  var db = window.sqlitePlugin.openDatabase("Database", "1.0", "Demo", -1);

  db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS test_table');
    tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

    tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
      console.log("insertId: " + res.insertId + " -- probably 1");
      console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

      tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
        console.log("res.rows.length: " + res.rows.length + " -- should be 1");
        console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
      });

    }, function(e) {
      console.log("ERROR: " + e.message);
    });
  });
}

******************************************************************************************************************************************************************************************************************************/