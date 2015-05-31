
/* 
   Dependencies 
   Sorttable.js -- this helps make all tables sortable 
   Jquery -- Doesn't need to be explained 
*/

  
   var StanFanTech = StanFanTech || {}
       StanFanTech.tools =StanFanTech.tools || {}
var textCache = []
       $(function(){
          $.expr[':'].containsIgnoreCase = function(n,i,m){
                         return jQuery(n).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
           };

        $(document).on('keyup','input[type=search]',function () {
         
          var tableID = $(this).data("table")
        var object = {}
         if(typeof object[tableID] !='undefined'){}
          else{
            var listID = 'table-list'
            $(this).attr('list','table-list')
            var html = ''
            
            html +=' <datalist id="'+listID+'">'

            $('#table tbody tr td').each(function(){
             // console.log($(this).text() )
              var text = $(this).text()
              textCache[''+String(text)+''] = textCache[''+String(text)+''] ||  false
              if(textCache[''+String(text)+''] != true)
                html+='<option value="'+text+'">'
              textCache[''+String(text)+''] = true

            })

          object[tableID] = true
                html+='</datalist>'
          $(tableID).append(html)
          }
    
         
          if (this.value === '') {
            
            $('#Chart-Title').text('Graph Of All Archived Leads')
              $(tableID).find("tr").show();
            $(tableID).unhighlight();
          return;
          }

          if(/\s+$/.test(this.value)) {
            return
          }
          //hide all the rows
          $(tableID).find('tr:has(td)').hide();

          //split the current value of searchInput
          var data = this.value.split(" ");
                   
          //create a jquery object of the rows
          var jo = $(tableID).find("tr");
          
          //Recursively filter the jquery object to get results. 
          $.each(data, function (i, v) {
            jo = jo.filter("*:containsIgnoreCase('" + v + "')");
            console.log('jo',jo.filter("*:containsIgnoreCase('" + v + "')"))
          });

          //show the rows that match.
          jo.show()
          
          $('table').unhighlight();
          $('table').highlight(this.value,'highlight');
        })
       })

    var table = table || {}
    /* 
        THIS StanFanTech.TOOL adds commas to numbers 
        example StanFanTech.tools.addCommas('12123') returns 12,123
       
        */ 
        StanFanTech.tools.addCommas = function (str) {
          str += '';
          str = str.replace(/,/g, '');
          v = str.split('.');
          v1 = v[0];
          v2 = v.length > 1 ? '.' + v[1] : '';
          var rgx = /(\d+)(\d{3})/;
          while (rgx.test(v1)) {
            v1 = v1.replace(rgx, '$1' + ',' + '$2');
          }
          return v1 + v2;
        }
/* 
    END OF StanFanTech.tools.addCommas function 
 
    */

/* 
        THIS StanFanTech.TOOL checks to see if a string is a number number
        example StanFanTech.tools.isNumber('12123') returns true  
        example StanFanTech.tools.isNumber('12asdsad123') returns false 
        */ 

        StanFanTech.tools.isNumber = function (X) {
          var reg = new RegExp('^[-]?[0-9]+[\.]?[0-9]+$');
          return reg.test(X)
        }
/* 
   END OF StanFanTech.tools.isNumber function 
 
   */




/* //------- ASYNC BUILD TABLE   ------------- ///
    THE StanFanTech ASYNC BUILD_TABLE IS A FUNCTION THAT ALLOWS US TO TAKE JSON REQUEST AND CONVERT THEM TO TABLES JUST BY GIVING THE DATA AND ALLOWS US TO CUSTOMIZE THE DATA BY HAVING A CALLBACK 
    
    DEPENDENCIES 
    SORTTABLE    
    BOOTSTRAP 
    JQUERY 

    HERES THE BASIC CALL PARAMETERS 

    StanFanTech.tools.build_table (id,json,callback)

    ID: THIS USES THE STANDARD JQUERY ID CALLS SO FOR EXAMPLE THE ID WOULD BE #TEST OR COULD BE A CLASS LIKE .TEST 
    JSON: THIS COULD BE A URL OR A JSON OBJECT 
    CALLBACK: THIS ALLOWS YOU TO CUSTOMIZE THE TABLE AFTER IT IS BUILT 
    */


	var table_id  = ''
	var search_id = ''
    
	StanFanTech.tools.build_table = function (id, json, callback,wordwrap) {
    var id= id;
    var file= json;
     $(id).html('<center><div class="StanFanTech_chart_loading"></div><br/>Loading Table</center>')
      // IF THIS JSON ISN'T AN OBJECT THEN GO GET THE AJAX JSON REQUEST 
      if (typeof json !== 'object') {

        $.ajax({
          url: json,
          async: true,
          dataType: 'json',
          success: function (jsondata) {
            json = jsondata;
            build_table_after_get(json)
          }
        });
      }else{

        build_table_after_get(json)

      }
       if(wordwrap){
         var wordwrap = 'table-layout: fixed; width: 100%; word-wrap:break-word'
      }else{
         var wordwrap = '';
      }
      function build_table_after_get(json){
        // HTML IS EMPTY 
    	  var html = '';

	      // GIVE EACH TABLE A RANDOM ID 
	      table_id = 'table-' +Math.floor((Math.random()*1000000)+1);
	      search_id = 'search-' + Math.random()
	      //html += '<div class="clearFix"></div><input id="' + search_id + '" onkeyup="search_table(\''+table_id+'\',this)"type="text" placeholder="Type To Search Table" style="width:50%;margin-top:15px">'
	        
	      // ROWS ARRAY 
	      var rows = []
	      // START OF THE TABLE HTML 
	      //html += '<input id="search" placeholder="Type To Search">'
	     // html += '<div class="row-fluid"><div class="span12">'
       //table-bordered table-striped table-hover
	      html += '<table id="' + table_id + '" class="table table table-bordered table-striped table-hover" style="-webkit-border-top-left-radius: 10px;-moz-border-radius-topleft: 10px;border-top-left-radius: 10px;'+wordwrap+'"> '
	      html += '<thead style="cursor:pointer;text-transform:capitalize;color: #0088cc;">'
	      html += '<tr>'
	   
	      // FOR EACH JSON OBJECT NAME CREATE IT AS A TABLE HEADER
        if($(id).data('checkboxes') === true){
          html += '<th class="build_table_class {sorter: false} sorttable_nosort"><input type="checkbox" class="checkbox checkbox_table_mass" id="select_all_check_box_'+table_id+'" name="checkbox" value="" onclick="build_table_select_all(\''+table_id+'\',this)"></th>'
           }
         
    
           for (var x in json[0]){
               var og_name = x 
	             var check_for_sort = x.indexOf("_no_sort") !== -1
               var x  =x.replace(/_/g," ");
               var table_class = og_name+'_'+table_id+'_head'
              if(check_for_sort === true || x.toUpperCase() ==='ACTIONS'|| x.toUpperCase() ==='ACTION'){
                  html += '<th class="build_table_class {sorter: false} sorttable_nosort '+table_class+'  " style="pointer:default !important;"  >' + x.replace(/no sort/g," ") + '</th>'
                }else{
               
                  html += '<th class="'+og_name+'_head build_table_class ay-sort '+table_class+' "  >' + x + '</th>'
                }
      	    	  rows.push(x)
	    	 
	         }

        html += '</tr>'
        html += '</thead>'
        html += '<tbody >'
        	
        // FOR EACH JSON VALUE CREATE TABLE ROWS FOR IT 
     
      for (var x in json){
            	html += '<tr>';
                   if($(id).data('checkboxes') === true){
              html += '<td class="build_table_class"><input type="checkbox" class="checkbox checkbox_table  checkbox_' + table_id + '" id="checkbox" name="checkbox" value="" onclick="build_table_select_one(\''+table_id+'\',this)"></td>'}
            	for (d in json[x]) {
                    json[x][d] = json[x][d] || ''
                      if (StanFanTech.tools.isNumber(json[x][d]) === false) {
                    			var text = json[x][d]
                    			var sort_class = ''
                          if(text === ''){  text ='' }
                    		} else {
                    			var text = json[x][d]
                    			var sort_class = 'sorttable_numeric'
                           if(text === ''){  text ='0'  }
                    		}
                		var table_class = d+'_'+table_id
                    html += '<td class="' + d + ' ' + sort_class + ' ' + table_class + ' build_table_class">' + text + '</td>'
            	}

            html += '</tr>';
        }
        html += '</tbody>'
          if($(id).data('totals')){
              html += '<tfoot><tr>'
        
            if($(id).data('checkboxes') === true){
                    html +='<td class="build_table_class "></td>'
                  }
                 
                 for(objectnames in  json[0] ){
                    html +='<td class="build_table_class total_'+objectnames+'_'+table_id+'"></td>'
                 }
                 html +='</tr></tfoot>'
        }
        html += '</table>'
      //  html += '</div></div>'
        if( !json[0] ){
          //html = '<center><img src="http://thisblogisforwomen.com/wp-content/uploads/2012/02/no.gif?w=300" width="150px" height="150p"><br/><strong>No Results</strong></center>'
        	html = '<center><div class="alert alert-error" style="margin-top:10px"><i class="icon-warning-sign icon-large"></i><br/>No Results</div></center>'
        }
       
        // END OF BUILD TABLE
        // PUT THE TABLE INTO THE HTML DOM ID 
     


      if($(id).data('mobile_show')){
            html +='<style>@media only screen  and (max-width : 400px) {'
              for(var objectnames in json[0]){
                  var comma_split = $(id).data('mobile_show').split(',')
                      if($.inArray(objectnames,comma_split) !== -1 ) {
                            continue;  
                      }
                      html+='.'+objectnames+'_'+table_id+'{ display:none; }'+'\n'
                      html+='.'+objectnames+'_'+table_id+'_head{ display:none; }'+'\n'
                }
            html +='}</style>'
      }

      var n=id.split("#");

      //document.getElementById(''+n[1]+'').innerHTML = html
      

      $(id).html(html)
        if(callback){
              callback({
                table_id: table_id,
                container_id: id,
                rows: rows
              })
      }
      var html_options = ''
  
      account_type = 'admin'
      if( json[0] && account_type =='admin'){
        var url = window.location.protocol+'//'+window.location.host+'/'+window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/"))
       // html_options += '<button type="button" class="btn btn-primary btn-sm download_as_csv_button pull-right" id="download_as_csv_button_1" style="border-radius:0px !important;margin-left:5px" data-id="'+id+'" data-url="'+url+'/'+file+'type=search&limit=5000000">Download Table As CSV</button> '
        
      }
      //html_options +='<button type="button" class="btn btn-success btn-sm pull-right refresh_table"  style="border-radius:0px !important" data-id="'+id+'">Refresh Table</button>'
      
      $(id).prepend(html_options)
      global_table =$(html).find("tbody tr")
      
     table[id] = {
        url:file,
        callback:callback
     }
      $(document.body).on('click','.refresh_table',function(){

          var id = $(this).data('id')
          var table_data = table[id]
          StanFanTech.tools.build_table(id,table_data.url,table_data.callback)

      })
   //define the table search as an object, which can implement both functions and properties
   // count the totals 
   if($(id).data('totals')){
       for(objectnames in  json[0] ){
     
        var comma_split = $(id).data('totals').split(',')

        for (x in comma_split){
              if(comma_split[x] === objectnames){
                var total_count =0

                  $('.'+objectnames+'_'+table_id).each(function() {
                      
                    var total_spent_remaining = $(this).text().replace(/[^0-9\.]/g,'')  ;
                    console.log('totals',total_spent_remaining)
                        total_count =parseInt(total_count) + parseInt(total_spent_remaining) 
                        console.log('totals',total_count)

                  })

                 var money_sign,percent_sign =''
                if(json[0][objectnames].indexOf("$") !== -1){
                    var money_sign = '$'
                }            
                if(json[0][objectnames].indexOf("%") !== -1){
                    var percent_sign = '%'
                }
              $('.total_'+objectnames+'_'+table_id).html(StanFanTech.tools.addCommas(  total_count ))
              }
          }
        }
      }


       console.log('rows',rows.length)
       // $(id).html(html);
        // MAKE THE TABLE SORTABLE 
        function myTextExtraction(node)  
        {  
        
            // extract data from markup and return it  
            //$(node).text().replace(/\$|,/g, "");
            if(undefined !=  $(node).find('input').val() ){
            return $(node).find('input').val(); 
            }else{
              return $(node).text().replace(/\$|,/g, "")
            }
        } 
      var tablesorter_options={textExtraction: myTextExtraction}
      var tablesorter_options=''
        if(json.length >= 500){
         $("#"+table_id).tablesorter(tablesorter_options) 
         .tablesorterPager({container: $(id),size: 501}); 
       }else{
            $("#"+table_id).tablesorter(tablesorter_options) 
        
       }


        // CREATE A CALLBACK WITH THE TABLE_ID THE ROWS AND THE CONTAINER ID 

    delete rows;
    delete html;
    delete json;
}

      }
function build_table_select_all(table_id,element){
    if(document.getElementById('select_all_check_box_'+table_id).checked === true){
        $('.checkbox_'+table_id).each(function(){
            var tr = $(this).closest("tr:visible");
            tr.find('input[type="checkbox"]').prop("checked", true);
               // $('tr:visible  .checkbox_'+table_id).prop("checked", true);
       
              $(this).closest('tr:visible').css({'background':'#E6EFF8'})
              //$(this).closest('tr:visible >input[checkbox]').css({'background':'#E6EFF8'})

          })
    }else{
           $('.checkbox_'+table_id).prop("checked", false);
           $('.checkbox_'+table_id).each(function(){
           $(this).closest('tr:visible').css({'background':'white'})

          })
    }
}
function build_table_select_one(table_id,element){

    if( $(element).prop("checked") === true){
      $(element).closest('tr').css({'background':'#E6EFF8'})
    }else{
      $(element).closest('tr').css({'background':'white'})
    }
}

function search_table(table_id,input){

       $.expr[':'].containsIgnoreCase = function(n,i,m){
                  return jQuery(n).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
              };
          
          if (input.value === '') {
                 $("#"+table_id).find("tr").show();
                
                 return;
            }
            //hide all the rows
            $("#"+table_id).find('tr:has(td)').hide();
            //split the current value of searchInput
            var data = input.value.split(" ");
            //create a jquery object of the rows
            var jo = $("#"+table_id).find("tr");
            //Recursively filter the jquery object to get results. 
            $.each(data, function (i, v) {
                jo = jo.filter("*:containsIgnoreCase('" + v + "')");
         
            });
            //show the rows that match.
            jo.show()
            // recount total money lost
            //recount_total();
            //Removes the placeholder text 
 
}

(function($){$.extend({tablesorter:new
function(){var parsers=[],widgets=[];this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",cssChildRow:"expand-child",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,sortLocaleCompare:true,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:'/\.|\,/g',onRenderHeader:null,selectorHeaders:'thead th',debug:false};function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms");}this.benchmark=benchmark;function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s);}else{alert(s);}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug="";}if(table.tBodies.length==0)return;var rows=table.tBodies[0].rows;if(rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter);}else if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter);}if(!p){p=detectParserForColumn(table,rows,-1,i);}if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n";}list.push(p);}}if(table.config.debug){log(parsersDebug);}return list;};function detectParserForColumn(table,rows,rowIndex,cellIndex){var l=parsers.length,node=false,nodeValue=false,keepLooking=true;while(nodeValue==''&&keepLooking){rowIndex++;if(rows[rowIndex]){node=getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex);nodeValue=trimAndGetNodeText(table.config,node);if(table.config.debug){log('Checking if value was empty on row:'+rowIndex);}}else{keepLooking=false;}}for(var i=1;i<l;i++){if(parsers[i].is(nodeValue,table,node)){return parsers[i];}}return parsers[0];}function getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex){return rows[rowIndex].cells[cellIndex];}function trimAndGetNodeText(config,node){return $.trim(getElementText(config,node));}function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i];}}return false;}function buildCache(table){if(table.config.debug){var cacheTime=new Date();}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=$(table.tBodies[0].rows[i]),cols=[];if(c.hasClass(table.config.cssChildRow)){cache.row[cache.row.length-1]=cache.row[cache.row.length-1].add(c);continue;}cache.row.push(c);for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c[0].cells[j]),table,c[0].cells[j]));}cols.push(cache.normalized.length);cache.normalized.push(cols);cols=null;};if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime);}return cache;};function getElementText(config,node){var text="";if(!node)return"";if(!config.supportsTextContent)config.supportsTextContent=node.textContent||false;if(config.textExtraction=="simple"){if(config.supportsTextContent){text=node.textContent;}else{if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){text=node.childNodes[0].innerHTML;}else{text=node.innerHTML;}}}else{if(typeof(config.textExtraction)=="function"){text=config.textExtraction(node);}else{text=$(node).text();}}return text;}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){var pos=n[i][checkCell];rows.push(r[pos]);if(!table.config.appender){var l=r[pos].length;for(var j=0;j<l;j++){tableBody[0].appendChild(r[pos][j]);}}}if(table.config.appender){table.config.appender(table,rows);}rows=null;if(table.config.debug){benchmark("Rebuilt table:",appendTime);}applyWidget(table);setTimeout(function(){$(table).trigger("sortEnd");},0);};function buildHeaders(table){if(table.config.debug){var time=new Date();}var meta=($.metadata)?true:false;var header_index=computeTableHeaderCellIndexes(table);$tableHeaders=$(table.config.selectorHeaders,table).each(function(index){this.column=header_index[this.parentNode.rowIndex+"-"+this.cellIndex];this.order=formatSortingOrder(table.config.sortInitialOrder);this.count=this.order;if(checkHeaderMetadata(this)||checkHeaderOptions(table,index))this.sortDisabled=true;if(checkHeaderOptionsSortingLocked(table,index))this.order=this.lockedOrder=checkHeaderOptionsSortingLocked(table,index);if(!this.sortDisabled){var $th=$(this).addClass(table.config.cssHeader);if(table.config.onRenderHeader)table.config.onRenderHeader.apply($th);}table.config.headerList[index]=this;});if(table.config.debug){benchmark("Built headers:",time);log($tableHeaders);}return $tableHeaders;};function computeTableHeaderCellIndexes(t){var matrix=[];var lookup={};var thead=t.getElementsByTagName('THEAD')[0];var trs=thead.getElementsByTagName('TR');for(var i=0;i<trs.length;i++){var cells=trs[i].cells;for(var j=0;j<cells.length;j++){var c=cells[j];var rowIndex=c.parentNode.rowIndex;var cellId=rowIndex+"-"+c.cellIndex;var rowSpan=c.rowSpan||1;var colSpan=c.colSpan||1
var firstAvailCol;if(typeof(matrix[rowIndex])=="undefined"){matrix[rowIndex]=[];}for(var k=0;k<matrix[rowIndex].length+1;k++){if(typeof(matrix[rowIndex][k])=="undefined"){firstAvailCol=k;break;}}lookup[cellId]=firstAvailCol;for(var k=rowIndex;k<rowIndex+rowSpan;k++){if(typeof(matrix[k])=="undefined"){matrix[k]=[];}var matrixrow=matrix[k];for(var l=firstAvailCol;l<firstAvailCol+colSpan;l++){matrixrow[l]="x";}}}}return lookup;}function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++));}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell);}}}return arr;};function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true;};return false;}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true;};return false;}function checkHeaderOptionsSortingLocked(table,i){if((table.config.headers[i])&&(table.config.headers[i].lockedOrder))return table.config.headers[i].lockedOrder;return false;}function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table);}}function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i];}}};function formatSortingOrder(v){if(typeof(v)!="Number"){return(v.toLowerCase()=="desc")?1:0;}else{return(v==1)?1:0;}}function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true;}}return false;}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this);}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]]);}}function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$('<colgroup>');$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($('<col>').css('width',$(this).width()));});$(table).prepend(colgroup);};}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++;}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date();}var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(table.config.parsers[c].type=="text")?((order==0)?makeSortFunction("text","asc",c):makeSortFunction("text","desc",c)):((order==0)?makeSortFunction("numeric","asc",c):makeSortFunction("numeric","desc",c));var e="e"+i;dynamicExp+="var "+e+" = "+s;dynamicExp+="if("+e+") { return "+e+"; } ";dynamicExp+="else { ";}var orgOrderCol=cache.normalized[0].length-1;dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";for(var i=0;i<l;i++){dynamicExp+="}; ";}dynamicExp+="return 0; ";dynamicExp+="}; ";if(table.config.debug){benchmark("Evaling expression:"+dynamicExp,new Date());}eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime);}return cache;};function makeSortFunction(type,direction,index){var a="a["+index+"]",b="b["+index+"]";if(type=='text'&&direction=='asc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+a+" < "+b+") ? -1 : 1 )));";}else if(type=='text'&&direction=='desc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+b+" < "+a+") ? -1 : 1 )));";}else if(type=='numeric'&&direction=='asc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+a+" - "+b+"));";}else if(type=='numeric'&&direction=='desc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+b+" - "+a+"));";}};function makeSortText(i){return"((a["+i+"] < b["+i+"]) ? -1 : ((a["+i+"] > b["+i+"]) ? 1 : 0));";};function makeSortTextDesc(i){return"((b["+i+"] < a["+i+"]) ? -1 : ((b["+i+"] > a["+i+"]) ? 1 : 0));";};function makeSortNumeric(i){return"a["+i+"]-b["+i+"];";};function makeSortNumericDesc(i){return"b["+i+"]-a["+i+"];";};function sortText(a,b){if(table.config.sortLocaleCompare)return a.localeCompare(b);return((a<b)?-1:((a>b)?1:0));};function sortTextDesc(a,b){if(table.config.sortLocaleCompare)return b.localeCompare(a);return((b<a)?-1:((b>a)?1:0));};function sortNumeric(a,b){return a-b;};function sortNumericDesc(a,b){return b-a;};function getCachedSortType(parsers,i){return parsers[i].type;};this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies)return;var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$.data(this,"tablesorter",config);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){$this.trigger("sortStart");var $cell=$(this);var i=this.column;this.order=this.count++%2;if(this.lockedOrder)this.order=this.lockedOrder;if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j]);}}}config.sortList.push([i,this.order]);}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2;}}}else{config.sortList.push([i,this.order]);}};setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache));},1);return false;}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false;}});$this.bind("update",function(){var me=this;setTimeout(function(){me.config.parsers=buildParserCache(me,$headers);cache=buildCache(me);},1);}).bind("updateCell",function(e,cell){var config=this.config;var pos=[(cell.parentNode.rowIndex-1),cell.cellIndex];cache.normalized[pos[0]][pos[1]]=config.parsers[pos[1]].format(getElementText(config,cell),cell);}).bind("sorton",function(e,list){$(this).trigger("sortStart");config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache));}).bind("appendCache",function(){appendToTable(this,cache);}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this);}).bind("applyWidgets",function(){applyWidget(this);});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist;}if(config.sortList.length>0){$this.trigger("sorton",[config.sortList]);}applyWidget(this);});};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false;}}if(a){parsers.push(parser);};};this.addWidget=function(widget){widgets.push(widget);};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i;};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i;};this.isDigit=function(s,config){return/^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g,'')));};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild)this.removeChild(this.firstChild);}empty.apply(table.tBodies[0]);}else{table.tBodies[0].innerHTML="";}};}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:"text",is:function(s){return true;},format:function(s){return $.trim(s.toLocaleLowerCase());},type:"text"});ts.addParser({id:"digit",is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c);},format:function(s){return $.tablesorter.formatFloat(s);},type:"numeric"});ts.addParser({id:"currency",is:function(s){return/^[Â£$â‚¬?.]/.test(s);},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[Â£$â‚¬]/g),""));},type:"numeric"});ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);},format:function(s){var a=s.split("."),r="",l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+="0"+item;}else{r+=item;}}return $.tablesorter.formatFloat(r);},type:"numeric"});ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s);},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));},type:"text"});ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0");},type:"numeric"});ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s));},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""));},type:"numeric"});ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"shortDate",is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);},format:function(s,table){var c=table.config;s=s.replace(/\-/g,"/");if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2");}else if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1");}else if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3");}return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime());},type:"numeric"});ts.addParser({id:"metadata",is:function(s){return false;},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?'sortValue':c.parserMetadataName;return $(cell).metadata()[p];},type:"numeric"});ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date();}var $tr,row=-1,odd;$("tr:visible",table.tBodies[0]).each(function(i){$tr=$(this);if(!$tr.hasClass(table.config.cssChildRow))row++;odd=(row%2==0);$tr.removeClass(table.config.widgetZebra.css[odd?0:1]).addClass(table.config.widgetZebra.css[odd?1:0])});if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time);}}});})(jQuery);


// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini

// http://dean.edwards.name/weblog/2005/10/add-event/
// HTML5 datalist plugin v.0.1
// Copyright (c) 2010-The End of Time, Mike Taylor, http://miketaylr.com
// MIT Licensed: http://www.opensource.org/licenses/mit-license.php

$.fn.datalist=function(){return typeof this[0].list==="object"&&this[0].list!==undefined?this:this.each(function(){var a=$(this),d=$("#"+a.attr("list")),g=d.find("option"),c=a.width(),h=a.height(),b=$("<ul>",{"class":"datalist",width:c,css:{position:"absolute",left:0,top:h+6}});c=$("<div>").css("position","relative");if(d.length)g.each(function(e,f){$("<li>").append('<span class="value">'+f.value+"</span>").append('<span class="label">'+f.label+"</span>").appendTo(b)});else return this;a.wrap(c);
b.hide().insertAfter(a);a.focus(function(){b.show()});a.blur(function(){b.hide()});a.next().find("li").mousedown(function(){var e=$(this).find("span.value").text();a.val(e)})})}; 


function dean_addEvent(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else {
    // assign each event handler a unique ID
    if (!handler.$$guid) handler.$$guid = dean_addEvent.guid++;
    // create a hash table of event types for the element
    if (!element.events) element.events = {};
    // create a hash table of event handlers for each element/event pair
    var handlers = element.events[type];
    if (!handlers) {
      handlers = element.events[type] = {};
      // store the existing event handler (if there is one)
      if (element["on" + type]) {
        handlers[0] = element["on" + type];
      }
    }
    // store the event handler in the hash table
    handlers[handler.$$guid] = handler;
    // assign a global event handler to do all the work
    element["on" + type] = handleEvent;
  }
};
// a counter used to create unique IDs
dean_addEvent.guid = 1;

function removeEvent(element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else {
    // delete the event handler from the hash table
    if (element.events && element.events[type]) {
      delete element.events[type][handler.$$guid];
    }
  }
};

function handleEvent(event) {
  var returnValue = true;
  // grab the event object (IE uses a global event object)
  event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
  // get a reference to the hash table of event handlers
  var handlers = this.events[event.type];
  // execute each event handler
  for (var i in handlers) {
    this.$$handleEvent = handlers[i];
    if (this.$$handleEvent(event) === false) {
      returnValue = false;
    }
  }
  return returnValue;
};

function fixEvent(event) {
  // add W3C standard event methods
  event.preventDefault = fixEvent.preventDefault;
  event.stopPropagation = fixEvent.stopPropagation;
  return event;
};
fixEvent.preventDefault = function() {
  this.returnValue = false;
};
fixEvent.stopPropagation = function() {
  this.cancelBubble = true;
}

// Dean's forEach: http://dean.edwards.name/base/forEach.js
/*
  forEach, version 1.0
  Copyright 2006, Dean Edwards
  License: http://www.opensource.org/licenses/mit-license.php
*/

// array-like enumeration
if (!Array.forEach) { // mozilla already supports this
  Array.forEach = function(array, block, context) {
    for (var i = 0; i < array.length; i++) {
      block.call(context, array[i], i, array);
    }
  };
}

// generic enumeration
Function.prototype.forEach = function(object, block, context) {
  for (var key in object) {
    if (typeof this.prototype[key] == "undefined") {
      block.call(context, object[key], key, object);
    }
  }
};

// character enumeration
String.forEach = function(string, block, context) {
  Array.forEach(string.split(""), function(chr, index) {
    block.call(context, chr, index, string);
  });
};

// globally resolve forEach enumeration
var forEach = function(object, block, context) {
  if (object) {
    var resolve = Object; // default
    if (object instanceof Function) {
      // functions have a "length" property
      resolve = Function;
    } else if (object.forEach instanceof Function) {
      // the object implements a custom forEach method so use that
      object.forEach(block, context);
      return;
    } else if (typeof object == "string") {
      // the object is a string
      resolve = String;
    } else if (typeof object.length == "number") {
      // the object is array-like
      resolve = Array;
    }
    resolve.forEach(object, block, context);
  }
};

jQuery.fn.table2CSV = function(options) {
    var options = jQuery.extend({
        separator: ',',
        header: [],
        delivery: 'popup' // popup, value
    },
    options);

    var csvData = [];
    var headerArr = [];
    var el = this;

    //header
    var numCols = options.header.length;
    var tmpRow = []; // construct header avalible array

    if (numCols > 0) {
        for (var i = 0; i < numCols; i++) {
            tmpRow[tmpRow.length] = formatData(options.header[i]);
        }
    } else {
        $(el).filter(':visible').find('th').each(function() {
            if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
        });
    }

    row2CSV(tmpRow);

    // actual data
    $(el).find('tr').each(function() {
        var tmpRow = [];
        $(this).filter(':visible').find('td').each(function() {
            if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
        });
        row2CSV(tmpRow);
    });
    if (options.delivery == 'popup') {
        var mydata = csvData.join('\n');
        return popup(mydata);
    } else {
        var mydata = csvData.join('\n');
        return mydata;
    }

    function row2CSV(tmpRow) {
        var tmp = tmpRow.join('') // to remove any blank rows
        // alert(tmp);
        if (tmpRow.length > 0 && tmp != '') {
            var mystr = tmpRow.join(options.separator);
            csvData[csvData.length] = mystr;
        }
    }
    function formatData(input) {
        // replace " with â€œ
        var regexp = new RegExp(/["]/g);
        var output = input.replace(regexp, "â€œ");
        //HTML
        var regexp = new RegExp(/\<[^\<]+\>/g);
        var output = output.replace(regexp, "");
        if (output == "") return '';
        return '"' + output + '"';
    }
    function popup(data) {
        var generator = window.open('', 'csv', 'height=400,width=600');
        generator.document.write('<html><head><title>CSV</title>');
        generator.document.write('</head><body >');
        generator.document.write('<textArea cols=70 rows=15 wrap="off" >');
        generator.document.write(data);
        generator.document.write('</textArea>');
        generator.document.write('</body></html>');
        generator.document.close();
        return true;
    }
};
/*
 * Metadata - jQuery plugin for parsing metadata from elements
 *
 * Copyright (c) 2006 John Resig, Yehuda Katz, J�örn Zaefferer, Paul McLanahan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

/**
 * Sets the type of metadata to use. Metadata is encoded in JSON, and each property
 * in the JSON will become a property of the element itself.
 *
 * There are three supported types of metadata storage:
 *
 *   attr:  Inside an attribute. The name parameter indicates *which* attribute.
 *          
 *   class: Inside the class attribute, wrapped in curly braces: { }
 *   
 *   elem:  Inside a child element (e.g. a script tag). The
 *          name parameter indicates *which* element.
 *          
 * The metadata for an element is loaded the first time the element is accessed via jQuery.
 *
 * As a result, you can define the metadata type, use $(expr) to load the metadata into the elements
 * matched by expr, then redefine the metadata type and run another $(expr) for other elements.
 * 
 * @name $.metadata.setType
 *
 * @example <p id="one" class="some_class {item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.metadata.setType("class")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from the class attribute
 * 
 * @example <p id="one" class="some_class" data="{item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.metadata.setType("attr", "data")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a "data" attribute
 * 
 * @example <p id="one" class="some_class"><script>{item_id: 1, item_label: 'Label'}</script>This is a p</p>
 * @before $.metadata.setType("elem", "script")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a nested script element
 * 
 * @param String type The encoding type
 * @param String name The name of the attribute to be used to get metadata (optional)
 * @cat Plugins/Metadata
 * @descr Sets the type of encoding to be used when loading metadata for the first time
 * @type undefined
 * @see metadata()
 */

(function($) {

$.extend({
  metadata : {
    defaults : {
      type: 'class',
      name: 'metadata',
      cre: /({.*})/,
      single: 'metadata'
    },
    setType: function( type, name ){
      this.defaults.type = type;
      this.defaults.name = name;
    },
    get: function( elem, opts ){
      var settings = $.extend({},this.defaults,opts);
      // check for empty string in single property
      if ( !settings.single.length ) settings.single = 'metadata';
      
      var data = $.data(elem, settings.single);
      // returned cached data if it already exists
      if ( data ) return data;
      
      data = "{}";
      
      if ( settings.type == "class" ) {
        var m = settings.cre.exec( elem.className );
        if ( m )
          data = m[1];
      } else if ( settings.type == "elem" ) {
        if( !elem.getElementsByTagName )
          return undefined;
        var e = elem.getElementsByTagName(settings.name);
        if ( e.length )
          data = $.trim(e[0].innerHTML);
      } else if ( elem.getAttribute != undefined ) {
        var attr = elem.getAttribute( settings.name );
        if ( attr )
          data = attr;
      }
      
      if ( data.indexOf( '{' ) <0 )
      data = "{" + data + "}";
      
      data = eval("(" + data + ")");
      
      $.data( elem, settings.single, data );
      return data;
    }
  }
});

/**
 * Returns the metadata object for the first member of the jQuery object.
 *
 * @name metadata
 * @descr Returns element's metadata object
 * @param Object opts An object contianing settings to override the defaults
 * @type jQuery
 * @cat Plugins/Metadata
 */
$.fn.metadata = function( opts ){
  return $.metadata.get( this[0], opts );
};

})(jQuery);
var global_table;
// TABLE SORTER PAGER
(function($) {
  $.extend({
    tablesorterPager: new function() {
      
      function updatePageDisplay(c) {
        var s = $(c.cssPageDisplay,c.container).val((c.page+1) + c.seperator + c.totalPages); 
      }
      
      function setPageSize(table,size) {
        var c = table.config;
        c.size = size;
        c.totalPages = Math.ceil(c.totalRows / c.size);
        c.pagerPositionSet = false;
        moveToPage(table);
        fixPosition(table);
      }
      
      function fixPosition(table) {
        var c = table.config;
        if(!c.pagerPositionSet && c.positionFixed) {
          var c = table.config, o = $(table);
          if(o.offset) {
            c.container.css({
              top: o.offset().top + o.height() + 'px',
              position: 'absolute'
            });
          }
          c.pagerPositionSet = true;
        }
      }
      
      function moveToFirstPage(table) {
        var c = table.config;
        c.page = 0;
        moveToPage(table);
      }
      
      function moveToLastPage(table) {
        var c = table.config;
        c.page = (c.totalPages-1);
        moveToPage(table);
      }
      
      function moveToNextPage(table) {
        var c = table.config;
        c.page++;
        if(c.page >= (c.totalPages-1)) {
          c.page = (c.totalPages-1);
        }
        console.log('toatal Pages',c.totalPages);
        console.log('table var',table);
        console.log('table confige',c);
        moveToPage(table);
      }
      
      function moveToPrevPage(table) {
        var c = table.config;
        c.page--;
        if(c.page <= 0) {
          c.page = 0;
        }
        moveToPage(table);
      }
            
      
      function moveToPage(table) {
        var c = table.config;
        if(c.page < 0 || c.page > (c.totalPages-1)) {
          c.page = 0;
        }
        
        renderTable(table,c.rowsCopy);
      }
      
      function renderTable(table,rows) {
        
        var c = table.config;
        var l = rows.length;
        var s = (c.page * c.size);
        var e = (s + c.size);
        if(e > rows.length ) {
          e = rows.length;
        }
        
        
        var tableBody = $(table.tBodies[0]);
        
        // clear the table body
        
        $.tablesorter.clearTableBody(table);
        
        for(var i = s; i < e; i++) {
          
          //tableBody.append(rows[i]);
          
          var o = rows[i];
          var l = o.length;
          for(var j=0; j < l; j++) {
            
            tableBody[0].appendChild(o[j]);

          }
        }
        
        fixPosition(table,tableBody);
        
        $(table).trigger("applyWidgets");
        
        if( c.page >= c.totalPages ) {
              moveToLastPage(table);
        }
        
        updatePageDisplay(c);
      }
      
      this.appender = function(table,rows) {
        
        var c = table.config;
        
        c.rowsCopy = rows;

        c.totalRows = rows.length;
        c.totalPages = Math.ceil(c.totalRows / c.size);
        
        renderTable(table,rows);
      };
      
      this.defaults = {
        size: 10,
        offset: 0,
        page: 0,
        totalRows: 0,
        totalPages: 0,
        container: null,
        cssNext: '.next',
        cssPrev: '.prev',
        cssFirst: '.first',
        cssLast: '.last',
        cssPageDisplay: '.pagedisplay',
        cssPageSize: '.pagesize',
        seperator: "/",
        positionFixed: false,
        appender: this.appender
      };
      
      this.construct = function(settings) {

              var pager_html  = '';
              pager_html +='<div id="pager" class="pull-right " >' 
              pager_html +='<button class="btn btn-mini first"> << </button>' 
              pager_html +='<button class="btn btn-mini prev"> < </button>' 
              pager_html +='<input type="text" class="pagedisplay" value="1/" style="height:15px;margin-bottom: 0px;width:40px"/>' 
              pager_html +='<button class="btn btn-mini next"> > </button>' 
              pager_html +='<button class="btn btn-mini last"> >> </button>' 
                pager_html +='<select class="pagesize" style="width:80px;height:25px;margin-bottom: 0px;margin-left:5px">' 
                pager_html +='<option  value="10">10</option>' 
                pager_html +='<option value="25">25</option>' 
                pager_html +='<option  value="50">50</option>' 
                pager_html +='<option value="100">100</option>' 
                pager_html +='<option value="250">250</option>' 
                pager_html +='<option  selected="selected"  value="500">500</option>' 
                pager_html +='<option  value="1000">1000</option>' 
                pager_html +='<option value="100000000">Show All</option>' 
                pager_html +='</select>' 
             pager_html +='</div>' 
          $(settings.container.selector).append(pager_html)
        return this.each(function() { 
          
          config = $.extend(this.config, $.tablesorterPager.defaults, settings);
          var table = this, pager = config.container;
          $(this).trigger("appendCache");
        
          config.size = parseInt($(".pagesize",pager).val());
    
          $(config.cssFirst,pager).click(function() {
            $(pager).fadeOut('50',function(){  moveToFirstPage(table)      })
            setTimeout(function(){ $(pager).fadeIn('500') },500)
        
       
            //$('html, body').animate({scrollTop: ($(pager).scrollTop() + 10) + 'px'}, 300);
            return false;
          });
          $(config.cssNext,pager).click(function() {
            $(pager).fadeOut('50',function(){    moveToNextPage(table) } )
            setTimeout(function(){ $(pager).fadeIn('500') },500)
            //$(window).scrollTop($(pager).position().top)
            //$(window).animate({ scrollTop: $(pager).position().top }, 500);

            //$('html, body').animate({scrollTop: ($(pager).scrollTop() + 10) + 'px'}, 300);
            return false;
          });
          $(config.cssPrev,pager).click(function() {
            $(pager).fadeOut('50',function(){  moveToPrevPage(table)  } )
            setTimeout(function(){ $(pager).fadeIn('500') },500)
            //$('html, body').animate({scrollTop: ($(pager).scrollTop() + 10) + 'px'}, 300);
            return false;
          });
          $(config.cssLast,pager).click(function() {
            $(pager).fadeOut('50',function(){  moveToLastPage(table) } )
            setTimeout(function(){ $(pager).fadeIn('500') },500)
            
            //$('html, body').animate({scrollTop: ($(pager).scrollTop() + 10) + 'px'}, 300);
            return false;
          });
          $(config.cssPageSize,pager).change(function() {
            setPageSize(table,parseInt($(this).val()));
            return false;
          });
        });
      };
      
    }
  });
  // extend plugin scope
  $.fn.extend({
        tablesorterPager: $.tablesorterPager.construct
  });
  
})(jQuery);       

/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
/*
 * jQuery Highlight plugin
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Code a little bit refactored and cleaned (in my humble opinion).
 * Most important changes:
 *  - has an option to highlight only entire words (wordsOnly - false by default),
 *  - has an option to be case sensitive (caseSensitive - false by default)
 *  - highlight element tag and class names can be specified in options
 *
 * Usage:
 *   // wrap every occurrance of text 'lorem' in content
 *   // with <span class='highlight'> (default options)
 *   $('#content').highlight('lorem');
 *
 *   // search for and highlight more terms at once
 *   // so you can save some time on traversing DOM
 *   $('#content').highlight(['lorem', 'ipsum']);
 *   $('#content').highlight('lorem ipsum');
 *
 *   // search only for entire word 'lorem'
 *   $('#content').highlight('lorem', { wordsOnly: true });
 *
 *   // don't ignore case during search of term 'lorem'
 *   $('#content').highlight('lorem', { caseSensitive: true });
 *
 *   // wrap every occurrance of term 'ipsum' in content
 *   // with <em class='important'>
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
 *
 *   // remove default highlight
 *   $('#content').unhighlight();
 *
 *   // remove custom highlight
 *   $('#content').unhighlight({ element: 'em', className: 'important' });
 *
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed under MIT license.
 *
 */

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);
    
    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);
    
    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};
$(".highlight").css({ backgroundColor: "#FFFF88" });

var loading_icon = "<style>.highlight {background-color: #FFFF88;}th.header {cursor: pointer; font-weight: bold; background-repeat: no-repeat; background-position: center right; padding-left: 20px;   margin-left: -1px; } th.headerSortUp {background-image: url('data:image/jpeg;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7'); }th.headerSortDown { background-image: url('data:image/jpeg;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7'); }  .StanFanTech_chart_loading {width:100px;height:100px;background-image: url('data:image/gif;base64,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');}</style>"
$('html').append(loading_icon)

/*
    WORKING EXAMPLE  FOR ASYNC BUILD TABLE 
    <div id="test_build_table"> </div>
    <script>
    var StanFanTech = StanFanTech || {}
        StanFanTech.tools = {} 
    var test_json = [{"Website":"http:\/\/bucketlistwheels.com","Report_date":"2013-03-05","StanFanTech_clicks":"44180","GA_Clicks":"221416","GA_Page_Per_View":"5.26000022888184","Discrepency":"-37.3540","Spent":"131.6285"},{"Website":"http:\/\/bumpercandy.com","Report_date":"2013-03-05","StanFanTech_clicks":"38167","GA_Clicks":"227896","GA_Page_Per_View":"4.30999994277954","Discrepency":"-25.3622","Spent":"114.1880"},{"Website":"http:\/\/celebgossip.com","Report_date":"2013-03-05","StanFanTech_clicks":"182521","GA_Clicks":"983976","GA_Page_Per_View":"3.41000008583069","Discrepency":"-32.6121","Spent":"547.1450"}]

    StanFanTech.tools.build_table('#test_build_table',test_json,function(){
  
      $('.Website').each(function(x){
                    $(this).html('<a href="#" style="color:blue" onclick="alert(\'button clicked\')">'+$(this).html()+'</a>')


                        })

        })
    <//script>




    */