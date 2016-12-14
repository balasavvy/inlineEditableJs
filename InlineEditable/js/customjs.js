var inlineEditDefault={
    "data":[
        {"column1":"Bala","column2":"10th Std"}
    ],
    "columns":[
        
        {"name":"column1","displayName":"Student Name","fieldType":"text","editable": true,
			"fieldValues":"",	"defaultValue":""},
        {"name":"column2","displayName":"Class","fieldType":"text","editable": true,
			"fieldValues":"",	"defaultValue":""},
        //Default Action columns//
        {            
            "name":"actions",
			"displayName":"Add",
			"fieldType":"admin",
			"editable": false,
			"fieldValues":"",
			"defaultValue":""
        } 
    ]  
}       
var inlineDefaultTable01={
    "data":[
        {"column1":"Bala","column2":"11/1/1992","column3":"M","column4":true}
    ],
    "columns":[
        {"name":"column1","displayName":"Student Name","fieldType":"text","editable": true,
			"fieldValues":"",	"defaultValue":""},
        {"name":"column2","displayName":"Date","fieldType":"datetimepicker","editable": true,
			"fieldValues":"",	"defaultValue":""},
        {"name":"column3","displayName":"Gender","fieldType":"select","editable": true,
			"fieldValues": [
								['M','Male'],
								['F','Female']
						   ]},
        {"name":"column4","displayName":"status","fieldType":"checkbox","editable": true,
			"fieldValues":"",	"defaultValue":""},
        
        //Default Action columns//
        {            
            "name":"actions",
			"displayName":"Add",
			"fieldType":"admin",
			"editable": false,
			"fieldValues":"",
			"defaultValue":""
        } 
    ]  
} 
var inlineEditDefault02={
    "data":[
        {"column1":"Bala","column2":"10th Std"}
    ],
    "columns":[
        
        {"name":"column1","displayName":"Student Name","fieldType":"text","editable": true,
			"fieldValues":"",	"defaultValue":""},
        {"name":"column2","displayName":"Class","fieldType":"text","editable": true,
			"fieldValues":"",	"defaultValue":""},
        //Default Action columns//
        {            
            "name":"actions",
			"displayName":"Add",
			"fieldType":"admin",
			"editable": false,
			"fieldValues":"",
			"defaultValue":""
        } 
    ]  
}
var inlineEditDefault03={
    "data":[
        {"column1":"Bala","column2":"10th Std"},
		{"column1":"Bala1","column2":"12th Std"},
		{"column1":"Bala2","column2":"11th Std"},
		{"column1":"Bala3","column2":"10th Std"},
		{"column1":"Bala4","column2":"9th Std"},
		{"column1":"Bala5","column2":"11th Std"},
		{"column1":"Bala6","column2":"10th Std"},
		{"column1":"Bala7","column2":"12th Std"}
    ],
    "columns":[
        
        {"name":"column1","displayName":"Student Name","fieldType":"text","editable": true,
			"fieldValues":"",	"defaultValue":""},
        {"name":"column2","displayName":"Class","fieldType":"text","editable": true,
			"fieldValues":"",	"defaultValue":""},
        //Default Action columns//
        {            
            "name":"actions",
			"displayName":"Add",
			"fieldType":"admin",
			"editable": false,
			"fieldValues":"",
			"defaultValue":""
        } 
    ]  
}
var inlineEditDefault04={
    "data":[
        {"column1":"Ramesh","column2":"10th Std"},
		{"column1":"Prabhu","column2":"12th Std"},
		{"column1":"Ragul","column2":"11th Std"},
		{"column1":"Suresh","column2":"10th Std"},
		{"column1":"Ragu","column2":"9th Std"},
		{"column1":"Rathna","column2":"11th Std"},
		{"column1":"Deva","column2":"10th Std"},
		{"column1":"Arun","column2":"12th Std"}
    ],
    "columns":[
        
        {"name":"column1","displayName":"Student Name","fieldType":"text","editable": true,
			"fieldValues":"",	"defaultValue":""},
        {"name":"column2","displayName":"Class","fieldType":"text","editable": true,
			"fieldValues":"",	"defaultValue":""},
        //Default Action columns//
        {            
            "name":"actions",
			"displayName":"Add",
			"fieldType":"admin",
			"editable": false,
			"fieldValues":"",
			"defaultValue":""
        } 
    ]  
}
$(document).ready(function(){ 
    var date = new Date();
	date.setDate(date.getDate());
	$("div.panel-body").hide();
	$('.panel-heading span').each(function(){
		$(this).click(function(e){   
		e.preventDefault(); 
		$(this).parents("div.panel-heading").next('.panel-body').toggle();        

	});


	});
	$('body').on('click', '.addbtn', function (e) {
       
			$(this).parents("table").prev("button").trigger("click");
		});

	$('body').on('click', '.dynamicDate', function (e) {				
		$('.dynamicDate').datetimepicker({
		 format: 'MM/DD/YYYY',
			minDate: date,
			defaultDate:date
		}).on('changeDate', function(ev) {
			$(this).datetimepicker('hide');
		});			
	 });	
	$('#inlineDefaultTable' ).inlineEdiTable({
			customColumns:inlineEditDefault.columns,
			customdata:inlineEditDefault.data,
			addBtn:"true",
			editBtn:"true",
			deleteBtn:"true"
	}); 
	$('#inlineDefaultTable01' ).inlineEdiTable({
			customColumns:inlineDefaultTable01.columns,
			customdata:inlineDefaultTable01.data,
			addBtn:"true",
			editBtn:"true",
			deleteBtn:"true",
			disableCoumntoEdit:{"name":["column4"]}
	});
	$('#inlineDefaultTable02' ).inlineEdiTable({
				customColumns:inlineEditDefault02.columns,
				customdata:inlineEditDefault02.data,
				addBtn:"true",
				editBtn:"true",
				deleteBtn:"true",
				addCallback: function () {console.log("add function initiates");},
				editCallback: function () {
					//own scripts here
					alert("Edit function initiates");
				},
				deleteCallback: function () {
					//own scripts here
					alert("delete function initiates");

				},
				cancelCallback: function () {
					//own scripts here
					alert("cancel function initiates");
				},
                saveCallback: function () {
					//own scripts here
					alert("Save function initiates");
				}


		}); 
		$('#inlineDefaultTable03' ).inlineEdiTable({
				customColumns:inlineEditDefault03.columns,
				customdata:inlineEditDefault03.data,
				addBtn:"true",
				editBtn:"true",
				deleteBtn:"true",
				pagination:"true",
				rowsConatiner:$(this).find("tr"),
				paginationConatiner:$('#pagination03'),
				pageSize:2
		});
			$('#inlineDefaultTable04' ).inlineEdiTable({
				customColumns:inlineEditDefault04.columns,
				customdata:inlineEditDefault04.data,
				addBtn:"true",
				editBtn:"true",
				deleteBtn:"true",
				pagination:"true",
				rowsConatiner:$(this).find("tr"),
				paginationConatiner:$('#pagination04'),
				pageSize:2
		});

}); 