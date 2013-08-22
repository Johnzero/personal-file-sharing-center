/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
and Modified by Ace(i.orzace.com)
*/
(function() {

	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	//function Output(msg) {
		//var m = $id("messages");
		//m.innerHTML = msg + m.innerHTML;
	//}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}

    // update the progress bar
 	function uploadProgress(evt) {
        if (evt.lengthComputable) {
            var uploaded = Math.round(evt.loaded * 100 / evt.total);
            $("#upload_progress").show();
            $("#upload_progress_bar").attr("style","width:" + uploaded + "%;")
            //document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
        }
        else {
            //document.getElementById('progressNumber').innerHTML = 'unable to compute';
        }
    }

	// file selection
	function FileSelectHandler(e) {

        // cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;
        // init the ajax request
        // var xhr = new XMLHttpRequest();  
        // xhr.open('post', '/', true);  
        // // xhr.upload.addEventListener("load", function(e){window.location.reload()},false);
        // xhr.upload.addEventListener("progress", uploadProgress, false);

        // var formData = new FormData();

		// process all File objects
		var counter = 0;
		var interval = setInterval(function() {
		    if(counter == files.length) {
		        clearInterval(interval);
		        console.log("All Files uploaded!");
		        setTimeout("window.location.reload();",1000);
		        // window.location.reload();
		    }
		}, 400)

		for (var i = 0, f; f = files[i]; i++) {
            var entry = e.dataTransfer.items[i].webkitGetAsEntry();
            if(entry.isFile){
            	var formData = new FormData();
                formData.append('file', f);
                var xhr = new XMLHttpRequest(); 
                xhr.onreadystatechange=function()
				{

					// console.log(xhr.readyState);
				} 
		        xhr.open('post', '/', true);  
		        // xhr.upload.addEventListener("load", function(e){window.location.reload()},false);
		        // xhr.upload.addEventListener("loadstart", function(e){console.log(counter);},false);
		        xhr.upload.addEventListener("abort", function(e){alert(f.name + "文件传输被用户取消");},false);
		        xhr.upload.addEventListener("loadEnd", function(e){console.log(f.name + "文件传输结束");},false);
		        xhr.upload.addEventListener("load", function(e){counter++},false);
		        xhr.upload.addEventListener("progress", uploadProgress, false);
		 		//* abort事件：传输被用户取消。
				//* error事件：传输中出现错误。
				//* loadstart事件：传输开始。
				//* loadEnd事件：传输结束，但是不知道成功还是失败。
                xhr.send(formData);
            }
            else if (entry.isDirectory){
            	console.log(entry);

            }
            else
            {
                alert("不能鉴别的文件类型");
                return;
            }
            
		}
        // xhr.send(formData);

	}

	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";

		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}


})();

function delete_file(obj)
{
    var name = obj.name;
    console.log(name);
    if(confirm("Delete " + name + ", are you sure?"))
    {
        $.ajax({
            url: '/' + name,
            type: 'DELETE',
            success: function(data){
                window.location.reload();
            }
        });
    }
    else
        return;
}
