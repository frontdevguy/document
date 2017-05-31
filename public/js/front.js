
function viewDocument(){
    "use strict";
    var departments = document.getElementById("departments");
    var options = departments.options[departments.selectedIndex].text;

    
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "/details" + "?" +"department=" + options, true);
    xhr.send();
   
    xhr.onreadystatechange = function(){
    	if(this.readyState === 4 && this.status === 200){
    		var response = JSON.parse(this.responseText);
            respText(response);
    	}
    }
}

function searchDocument(){
    "use strict";
    var searchSelect = document.getElementById("searchSelect"),
        search = searchSelect.options[searchSelect.selectedIndex].value,
        searchText = document.getElementById("searchText").value;

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "/details/search" + "?" + search + "=" + searchText, true);
    xhr.send();

    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            var resp = JSON.parse(this.responseText)
            searchResponse(resp);

        };
    };
};


function respText(response){
    "use strict";
    if(!response.length){
        document.getElementById("test").textContent = "No such document";
        return
    }
    else{
         for(var i=0; i<=response.length; i++){
        document.getElementById("test").textContent = response[i]["body"]; 
        break;
        }
    }
    document.getElementById("test").innerHTML += "<br/>"+"<button>"+"Delete "+ "document"+"</button>";
     document.getElementById("test").lastChild.onclick = function(){console.log(document.getElementById("test").innerText);}
    return;
   
};

function searchResponse(response){
    "use strict";
    if(!response.length){
        document.getElementById("showSearch").textContent = "No search found"
        return 
    }
    else{
         for(var i = 0; i<=response.length; i++){
        document.getElementById("showsearch").textContent = response[i]["body"];
        return;
        }
    } 
};

function deleteOption(){
    if(confirm("Delete this document")){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/delete", false)
    }
}

window.onload=function(){
	document.getElementById("viewsubmit").onclick = function(){ viewDocument();}; 
    document.getElementById("submitSearch").onclick = function(){ searchDocument();};
  
   
}
