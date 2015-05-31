
// This dynamically builds charts with simple parameters so that way you don't have 
// hundreds of differnet charts cluttering up the HTML page this one function can build
// hundreds of charts with simple and faster  
var series = [],
	get_chart ={};
    String.prototype.capitalize = function() { return this /* return this.charAt(0).toUpperCase() + this.slice(1);*/ }
/*
    BUILD CHART JQUERY PLUGIN
    DEPENDENCIES = HIGHCHARTS.js

 JSON FROM SERVER EXAMPLE
 [{report_date:'2012/3/3',clicks:10000},{report_date:'2012/3/4',clicks:10000},{report_date:'2012/3/5',clicks:10000},{report_date:'2012/3/5',clicks:10000},{report_date:'2012/3/5',clicks:10000}]

$('#test').build('chart',{
                            title:'', // This give the charts a title 
                            url: BASE_URL+'advertiser/api/get?type=campaign&action=stats&cid='+campaign_id, // this is the URL that grabs that JSON
                            chart_type: "line", // this tells the chart_widget what type of charts
                            chart_title: "", // this gives it the high charts title 
                            x_axis_title: '', // this is the x-axis title 
                            x_axis: 'report_date', // this tells chart_widget the x-axis is report_date in the json
                            y_axis_title: "", // this gives the y-axis title 
                            series:[{name:'clicks',data:'clicks'}] , // this is the chart seris based off the JSON
                            reverse:'true' // this reverses the json array incase the dates are one way
                          })


*/
var refresh_timer = {}
function addCommas(str) {

          str += '';
          str = str.replace(/,/g, '');
          v = str.split('.');
if(str.indexOf('.') !== -1)
{
var dollarSign = '$'
}else{ var dollarSign = '' }
          v1 = v[0];
          v2 = v.length > 1 ? '.' + v[1] : '';
          var rgx = /(\d+)(\d{3})/;
          while (rgx.test(v1)) {
            v1 = v1.replace(rgx, '$1' + ',' + '$2');
          }
          return dollarSign +v1 + v2;
        }
(function($) {

    $.fn.build = function(buildtype,options) {
       if($(this).selector.indexOf(".") != -1){
        alert('You Cannot Use Class Selctors For Build Charts Yet',true)
        return
        }
        var id =  $(this).selector.replace('#','')
        options['id'] = id
        
        if(buildtype === 'chart'){
           chart_widget(options)
        }

    }

}(jQuery));

function chart_widget(x,callback) {
    var html = '',
		x_axis = [],
		series_data = [],
        id = x.id,
        chart_info = x,
        b = x,
	    chart,
        y_axis_data =[]
        if(!x.refresh)
            $('#'+x.id).html('<center><div class="CW_chart_loading" ></div><br/>Loading Chart</center>') 

	   $.getJSON(x.url, function (jsondata){   build_chart(jsondata)    }).error(function(){
               $('#'+x.id).html('<center><br/><div class="alert alert-error" >Error Loading Chart</div></center>') 
       });


       if(x.refresh){

        
            clearInterval( refresh_timer[id])
           
            refresh_timer[id] = setInterval(function(){
                var series_data =[]
                $.getJSON(x.url, function (jsondata){ 
                    for(var n in b.series ){
                        y_axis_data = $.map(jsondata, function(o) {  return parseFloat(o[b.series[n].data]); })
                       series_data.push( {name: b.series[n].name,data:  y_axis_data })
                    }
                    b.data = series_data;
              
                        if(callback){
                            callback(b)  

                        }else{ 
                            chart_widget(b)
                        }
                })
            },x.refresh)
        if(get_chart[id]){  return  }
       }

            function build_chart(jsondata){




                        var series_data, minTickInterval,
            			data, series_data, key_id,
            			chart_series_data, chart_more_data,
            			abbrNum, chart_config, total,series_data = [];
            // THIS SETS THE MIN TICK INTERVAL 
            	       if(jsondata.length  <= 5){
                         var minTickInterval =0
                        }else{
                         var minTickInterval =  jsondata.length / 3
                        }

                        if(jsondata.length === 24)
                             var minTickInterval =  jsondata.length / 10
                        // THIS IS THE END OF MIN TICK INTERVAL 
                        if (x.reverse ==='true' && jsondata.length  >1 || x.reverse ===true && jsondata.length  >1 ) {
                            jsondata.reverse();
                        }

                    // START OF PLUCKING THE DATA THAT WE NEED
                         x_axis      = $.map(jsondata, function(o) {  return o[b.x_axis]; })  
                         series_data =[]
                        for(var n in b.series ){
                             y_axis_data = $.map(jsondata, function(o) {  return parseFloat(o[b.series[n].data]); }) // pluck the y_axis data that we need
                             
                             var chart_object = {} // create chart object
                             // loop and find any extra fields that may be used for example visible,showlegend,color..... blah 
                             for(var series_key in b.series[n]){
                                 if(series_key !='name' || series_key !='data')
                                 chart_object[series_key] = b.series[n][series_key]
                             }

                             chart_object['name'] = b.series[n].name // the name of the y_axis
                             chart_object['data'] =   y_axis_data // the data for the chart on the y_axis
                            
                                series_data.push( chart_object )
                       
                      
                        }

                    // END OF PLUCKING THE DATA THAT WE NEED 
     
                    console.log('series',series_data)

                    // IF  TYPE IS A PIE CHART REQUEST 
                        if(b.chart_type === 'pie'){
                            var series_data  = [];
                            var pie_data     = $.map(jsondata, function(o) {
                                                
                                                 if(parseFloat(o[b.series[0].data]) !== 0  && isNaN( parseFloat(o[b.series[0].data]) ) === false) {
                                                    series_data.push(  ["" +o[b.x_axis] + "",parseFloat(o[b.series[0].data]) ]  )
                                                    }
                                                 }) 
                            //console.log('series_data',series_data)

                                
                        }
                    // END OF PIE CHART REQUESTS
                    // IF WE GET NO DATA BACK 
                    console.log('chartstats',series_data)
                     if(!jsondata[0] || jsondata.status || series_data.length ===0  && b.chart_type !== 'pie' ){ 
                            var d = new Date()
                                for (var day=0;day<7;day++){
                                        var date = d.getMonth() + 1 +'-'+
                                                   d.getDate()  +'-'+
                                                   d.getFullYear()
                                                   
                                                   x_axis.push(date);

                                }
                                x_axis.reverse()
                            series_data=[{

                                name: 'No Data Available',
                                data: [0,0,0,0,0,0,0]
                            }]
               
                              
                    }

                    if(b.chart_type === 'pie'){
                        if(series_data.length === 0 || jsondata.status === false ){
                                var series_data = []
                                    series_data.push( [ "No Data" ,100 ]  )
                            }
                    }
                  // IF WE GET NO DATABACK END
                  if(b.chart_type === 'column'){
                    var dataLabels = {
                                         enabled:false,
                                         formatter:function() {
                                           // console.log('this.point',this.point)
                                           if(this.point.y >= 1)
                                             return addCommas(this.point.y);
                                         }
                                     }
                  }
                // START OF HIGHCHARTS CONFIG
                    chartConfig = {
                        colors:b.colors || ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                    	chart: {
                    		renderTo:id,
                    		type: b.chart_type,
                            backgroundColor:'rgba(255, 255, 255, 0.0)',
                    		marginRight: 30,
                            spacingLeft: 0, 
                            spacingRight: 0
                        },

                    	title: {
                    		text: chart_info.chart_title,
                            x: -20
                        },
                        subtitle: {
                        	text: ''
                        	
                        },
                        credits: {
            	            enabled: false,
                            text:''
            	        },
                        exporting: {
                            enabled: false
                        },
                        xAxis: {
                            categories: x_axis,
                        	minTickInterval:minTickInterval,
                            type: 'datetime',
                            showLastLabel: true,
                            // gridLineWidth: 1,
                            // minorGridLineWidth: 1,
                            // endOnTick: true,
                            title: {
                                text: chart_info.x_axis_title
                            }

                     //endOnTick:true
                         },
                        yAxis: {
                        	title: {
                        		text:'' //chart_info.y_axis_title
                        	},
                            showLastLabel: true,
                            gridLineWidth: 1,
                               minorGridLineWidth: 1,
                        	   plotLines: [{
                        		value: 0,
                        		width: 1,
                        		color: '#808080'
                        	   }]
                        },
                        tooltip: {
                        	formatter: function () {
                        		return '<b>' + this.series.name.capitalize() + '</b><br/>' + this.x + ': ' + addCommas(this.y);
                        	}
                        },
                       legend: {
                        /*
                                     align: 'right',
                                     verticalAlign: 'top',
                                     y: 0,
                                     floating: false,
                            */
                        borderWidth: 0,
                        itemMarginBottom: 5,
                        labelFormatter: function() {
                            var total = 0;
                            for(var i=this.yData.length; i--;) { total += this.yData[i]; };
                                return this.name + ' (' + addCommas(total)+')';
                        }
                                 },  
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            },
                                dataLabels: dataLabels || {}
                        },
                        column:{
                                stacking: 'normal'
                        }
                    },
  
                        series: series_data
                    };
             
                if(b.chart_type === 'pie'){
                    var chartConfig = ''
                        chartConfig={

                                chart: {
                                        renderTo:id,
                                    plotBackgroundColor: null,
                                    plotBorderWidth: null,
                                    plotShadow: false,
                                    backgroundColor:'rgba(255, 255, 255, 0.0)'

                                },
                                title: {
                                    text: ''
                                },
                                 credits: {
                                    enabled: false,
                                    text:''
                                },
                                exporting: {
                                    enabled: false
                                },
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            color: '#000000',
                                            connectorColor: '#000000',
                                            formatter: function() {
                                              if(this.point.name.length > 6){ 
                                              var name =this.point.name.substr(0,6)+'...';}
                                            else{var name =this.point.name;}
                                                return ''+ name+': '+ this.percentage.toFixed(2) +' %';
                                            }
                                        }
                                    }
                                },
                                   tooltip: {
                                    formatter: function () {
                                        
                                        return '<b>' + this.key.capitalize() + '</b> <br/> '+b.series[0].name+': ' + addCommas(this.y);
                                    }
                                },
                                series: [{
                                    type: 'pie',
                                    name: 'Amount',
                                    data: series_data
                                }]
                            }




                    }

                    get_chart[''+b.id+''] = new Highcharts.Chart(chartConfig);
                    return get_chart[''+b.id+''];
        }

}
var chart_loading = "<style >.CW_chart_loading {width:100px;height:100px;background-image: url('data:image/gif;base64,R0lGODlhZABkAKUAACQmJJyanFxeXMzOzOzq7ERCRHx6fLy6vDQ2NGxubNze3KyqrPT29ExOTIyKjMTGxCwuLKSipGRmZNTW1PTy9ISChMTCxDw+PHR2dOTm5Pz+/FRWVCwqLJyenGRiZNTS1Ozu7ExKTLy+vDw6PHRydOTi5LSytPz6/FRSVJSSlMzKzDQyNKSmpGxqbNza3ISGhP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBgAwACwAAAAAZABkAAAG/kCYcEgsGo/IokZzYjBORYbClQExNMmsdsvtZk8gQknx+TxcRVcjJGg5IqYByEuv248MgmswsIj8fhNFEyMAhoYrIR4vJiV3j5BGTAQTD4B/mBYWgkSEhxyHABwQFwkHBAyRql5gLg+ZsH4iIpxDH4WhoJ+GBQ4Pc6vBkpSWl7GZtUITCKG5zQAjGAepwsEaIGaas5fcyEW3z+G6HCMtFlDVjxoUH8ba3dwHyTCe4fafEi7U6V1MJZaZZMGLNQ+cIVC6DorjFaAEFn5bKPQ5NlAgpnn1nCVM6AyChA8Qs2ggALAbRYoFcYl6tnGlswIm0IUkwsDFu5MVt9EapNJl/jOO9lZUcDRTiIYMFnMq3UnE4D1nPhVykEC0KIN2mLKaVIpRJdCnX0W1IFBUCIMJgJZWlPet51OWUVeweFj2xIdZOI/B6rrr7dMRAWRWO0F3yFljWg/k/JPS71tQKwJQgHg1Q2EY67DeVMuYZ1/HPyNMVqLqqiaHRg7r3IryGzPQQSMcoYAKkgabsx6gLnJiImcLKgZMIEuEQAoSHgpwCPs3sBG7Flxc9kKAm248mv8cOKZCAQEKT6afEPPBhAMUzJ9FHk0E+h/idNa94mbBshLVabedAUGYDgUKKhigXHoriKYEO5r4oQIF02VxFSzbWFCCYGahpdg23TEYyQku/qQQQliAzWaTBdv58cE+W2jwD32Y6Dbdgwq6oGEwdlUwAkeAsTcEghcKtNsWDKiw2pAPZCDJgwMQQGEwFFiA3kGSPTdij5iogGISGqCV12ni2VcUBRWsUKAk7CiW1EUNFgECa+7otmRZOy6wwJIIkliRBcAkYdeWWV0HJxInLAmdOxfq9MGbRpH0GyBe/imSewKx6McDBKR5wgRDnhRQo45it1g3hyKx5m+ZFJlmp5AOCUihk+ZJxG0QnnmMC4h2CgMBfKoqXWol/bFVUiqcaqsGA8RSYkCwPLAkrktF6Kurts7GWSxGfqMpa7RG+4UCpMoCEk29KiXLgtpqAeC1/rFY8ACKSPFppyYKCFuuBtzmpV2E1WKG27QikFuuFkHqlO6sD/XWrQi7/iuSC1seayI1IAgJj8Ow6KiwqEpR+ccDo1XnbpW1XiyEwR9rYqSKJf+RsMhI3DaQpg5x6K5iilXKMpa4pkzrniVzfHMW557J2qEMTIQuIAOEfDOMn2IygBMSswlLtj8DquWdWllZtAoPdP2ACupyzfXXXXcnL8v0kl122F6DPbaVVcct99x012333XjnXXfRar9d9t9fx4u3in0D7vfXTwdc8gRKs3ypO3oBsm6Qm+V1It4ki4vJiXuS6q/dQdsLCOcMQ56TzXWPlDLChJWQsgWCp14v/qmoeSy1Vknb3ZtWkWdCXMRb5ocn6N2qO1rm6GKyctxZNp2VCJfrG7xW69J9AkDu+rFyuxbFGlDscZfwW4kSgiuppgNYzHLoph9TfVPeT+wr1TefoECu3HxLBPcfi/BL1SAIl7FMki/DzMd7FLHAAM72Jw3cZS0UUZYk9hWrnCigcXBilui0srwhjGpgOKkPA4vSOVX5SjtpgdYQStg+k5iKZaaBEO8uEaojjESAdkJhQH50MQ3EMD+88xWnePPATGiMG1XR1hKec5d7Vc5E8lqTEU/ion+dIAOoowlW4vcHFUqiiEqZ0HOGyI/bWKKARoGRDkn0hw8wMGBKQSNm/kwjBwzWAQy+kZCgrhaL96VIfDP0FQ9HVsQHKEB9kaCAAnrlPzFGYYts5JIXHkQRR7YHjH4YgAKuEAkfKsA3yUqiYSA5i+j1g32CvIwP+RgQFUyAAv3xAhMo4AqsifA+2VnQCItDH1GaJTvt0+R3wiOJJtDmkxs8zZLwI8d+lO4Pg4TBWQLpDkAExwXwMUsJJvABiaWsio+Mzi5T80BLGuaZ05IFGoggxYNdokh4KMGV7HCWIa5SaO5apwdxiD8hLmmcehLPA905C30KoUlcnBY4/8RCE4prHgjFZ/YaCdA74Od13mAnP0+oFkZVlA4/dGjvdGJQGET0WhRDzOjsyHiHoxA0h4AoaQDd6bDRzZMfNWkWPmWBMDUdcGbxUNlNIXJDqWmupBFNJ+9UQMayIMhZOXSi92SqjYTi5ANehJMPV2RVmCrPp8nsozw/SiN2aEV+BClCk5rmVQt8AJY3u0Y2qDkrsJLqAR/I4s/GU4kWctCnslpVWobDUm2Np5b2QqrwIugC/uhtEnON5All+tOk4BUVZBVZHvYAtqmpaTPA+QAVhqq3V4FBDGQYQHfUyrUyuKAEVYhlaWUZKAbAtT1OeIJsOxUEACH5BAkGADAALAAAAABkAGQAhSQmJJSWlMzOzFxeXOzq7Hx6fLSytERCRNze3GxubDw6PKSmpPT29IyKjMTCxCwuLNTW1GRmZISChExOTJyenPTy9Ly+vOTm5HR2dKyurPz+/MzKzCwqLJyanNTS1GRiZOzu7Hx+fLS2tExKTOTi5HRydDw+PKyqrPz6/JSSlMTGxDQyNNza3GxqbISGhFRWVP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb+QJhwSCwaj8iiRoNiMFDKihO1TFqv2KzWigIRSAiPR8UqVjYbAYRFIoCg27h8bmQQWAKBw7LfQ8wqfH0OaQgEDHSJikZMBBAqfXySDg5/RBWQFpKafSoQhxqLoltdLIGRqJoWlkOYqK98Kghvo7VHGo6QkZO8lYCpwLGfoba1GiBjlJy9vaxCmMzBlCoeIMTFdBoVHrvK0pLOMK6bqbyTHgzX2FlMJJmDy9++l+/R9hYbJOnrWRV69sF4hRvXDSAvDxX4WcFVr6A8PgNPMSNHMdKGC+oUCmHAwpvBgH5+RYMnyFwfFog0CtFwYc/HlxFd3isHDJ3KjdwoTpQX0+T+THse4KhkAAHew2ADPdKMt5MPxptCUHhQdbTiKkAfQU5yQCJjLSp1im6yCrJn1aVcvY5i4OEpEW05lb6c18qhwV5pGYliS6lrWJdagZl9GY3EEQQnDCfS0FGTCr9FUPw7m8YDgSIMSEDwsOEnsLxFLiR4IEGoHAKoHh/h69OiISlglaCoUOFOZ8AAuZoWQqAEBwArRMzRJnGQ2yEaiMISxOKN2iRMKkDY8BAychIJfgMAcMDDcyRszQkisRuGcnIbEOxTpA0BdZNcD2ffDuB3hAtbNLiDteex1/B7bMBCBd/JoU1Hr5BnBAgtaFffditQUB54nbVmgQr4KRHeBrT+rNPFe5Qg4BUBGGjn4HYjIMCOWPKARgQKxynEGCUZvoVAC/TlmGMJExYBAlrkPNYjVCzFKAR2JupIHwcOXCHVXI4pBtUtI/qm5JUtJIQEQ2f1YeSUt5Bg5ZXbOaiAAc+hAAFTnjnwJZhEkIBjmTkmueNlR/x41iQYFjglAQ1eeeKD2ynQJCMs+GThHiwMCWcGdApKKKENpEQEAw3RhBshfoKJwgtK2nmlAlIOQQBhJVECApxYOKDAoIPWud0JRkwVGEWNsnoFAy44GCuZLWDWUG6abKClrlZAMMGvZNZHKhEtQUmJAyIie4UGKfjabJ20rtRYVcUea20SCBywbaj+HBQAh2R7MtqptRoUEOm52w2AJwi3NdXNquNisYGo5x6wAW/t4uNov8+ASm+OKxgAg37SUsLCu+Oi0MC853LQAQooJAouHwRQbC0KIjBLZroVPDlXgPwifIUHI2C8bQuH/OMZHwIc7DIMJHywcI4v6HMbkJHkurMVFcg7acAoCbCBClCrQJ3UVEvtgNQTH71QAAco0PUBYIftNdhjv1CG1minrfbabLft9ttwx42ZAFU/XTfUdqcn8rj63e133gI4UeFZEOjsspp2OaSC4HJ9Y9Pb7GYlCTpP7mks3GcQ1gflHpPFTMhu4yKtJo1C3G61bWuAQMF+oabvMjgbXrH+AJ5vCrIQ+EruTctrV9Du1VpG/g2ue8OpAYtNjfU4Y7pzsjjbKGSysgVZCxEtbotSW/yUJOw53qWZ3iWAuEdnTjQvzxNha+3kOGD00SggoPk5RlwP5YW8uwzCsA9ZUOMQmEreZwSwPX5oYH0BYQolyjOjnXyjegg7VYuYAUEi6AkvCtzKm1hVuQyOZRD5G0IHE2eOPu2MNbvAoCaCsiUC8C831kFYcuKSqoo4AHRIGOHr4sM3r6jMdqhgoRV+tKhJxJCDF8DhpXKiKErgaSEIBIiCIrNBWzAGEv9bCYBU6J0sMCBf2OtDqbTIDQF0CBtdmIxujIA48RCCfNDpHgb+++LD9ckCjouoAALqcaEpLhGIR7RCeODjRxEicA8CUE8BkcMABEwGfWPECfYepwVt5MuIGUkO8rayAQikbG/RMYU0vJRJFOKDQHNwnTciaR4a2iWRBICNV5jAgNo48i6DKORGWPREA3XORYZkX6rSwIJemkcznBldfwLJl/fNAUC6hIGaRreJsw2BiAWLBIaOUAF97KUtpXRlxAbjPeMw8Ct1VCYvrIk7EoLLP3DSYTmp56MXAnEkfVxkHM4DrmCwEwb7A0mXnKJPLyLPnRb6p+9wmUGZbE522bBfNpfxz4BS5X5GoaRGOFKQJu4kKTUsGB9QAiYu7RAgIJ0nYC6RAtFabGNT5ytaPW1nlWhUA16Z4WM/U3qUVKRnPSN76V0UmNLX9QIhLdXIMcagr1RUVHr3fIVlkgoVFDhCGbis6HIc4oCpuq0Ug7uHQj0SUuac8W2N4AZW21dUhwrCMkCVGwDvwBmjhGN/7SPmBajKtuRU4AIkYIEHnKZQpwnAA2y4wCflaiBapiwytHlCFXQVBAAh+QQJBgAwACwAAAAAZABkAIUkJiSUlpRcXlzMzszs6uxEQkR8eny0srRsbmzc3tw8Ojz09vRUVlTEwsSkpqSEhoQsLixkZmTU1tRMSkycnpz08vSEgoS8urx0dnTk5uT8/vzMyswsKiycmpxkYmTU0tTs7uxERkR8fnx0cnTk4uQ8Pjz8+vxcWlzExsSsrqyMjow0MjRsamzc2txMTky8vrz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kCYcEgsGo/IokZjWixMyorTtExar9is1moCEUiJzwfVKlY2m4GkRSKAoNu4fG5cEFqDQeO130vMKHx9DWkJBAt0iYpGTAQSKH18kg0Nf0QVkC+Smn0oEocai6JbXS2BkaiaL5ZDmKivfCgJb6O1RxqOkJGTvJWAqcCxn6G2tRogY5Scvb2sQpjMwZQoHyDExXQaFR+7ytJ8F84wrpupvJMfC9fYWUwkmYPL376X8NH3Lxsk6uxZFXr3gvESR65bQF4fKvSzgsuewXl8CJ5iVq5ipA0Z1i0UsqCFt4MC/fyKFk/QuT4tEG0UoiHDHpAwJb7EZw5YupUcuVWkOE/m/kma9z7AWblAQjyIwMKZ+VhTHk8+GXEKMfFBFVKLqwCBDHlhEAmNtajUMbqpXFeaPpGeffi134IPUYlo08kUJr1WDw/2atBWiai3lPoSKfoyZLS04BqsTexUcYMMRypkUJnNoyYUgoeYAHiVkBoCRRaQELOh19mAfMESbgFWCwFUmI8AnnSB2QZDUsQqaVKBQILShVGTGKqZbAPQcrRNHBR3iAbCkwqTedM6CZUKEjZAbM4S+p4NFaojeXtO0PCxjjndDr9I2++afGXTlXRTi4Z3sPZgVl31ewv2xlRgyiuZTdXfMnwUmMQCpf2kH2RKkDcAAcTZ0oV2giSgmnHR/uVDGUMcSpOaESZw148GHj3GyGzmaCKBeEOA0FQ3mFUolXMZmAgDVSJS0gAIV1Bl12Uk3IhEFUUI+VBtqgiVREOd9aGjkbvNZxIsKBBQnQkSOAUUJVNSmdOXy0hgoxAydjYJCmFSySNWwUWCApCMtPCTg5K0cKaYMBDQISx7sVaHQ/DJswGMVGowwE5xnoPCh0L4CREng9DJJxIVXJXYHsgRceCMFel5qXUJzHNaYR+E5hBqmoA3qhVnbMXLo0S4ZFdXlGj46pOl6qXYJBDCgKKarSq064LAyUrJi1NxNqSgxx5pZ6NNvVAfCMmiUlswxkaLhIxXLgbMBnS+NuR3/nt6uyNA50J237l8QKtunfA2oKEJ04LUVVdaznuLuaYWpqeQ56LQrb9FYMsonOkswK5hfQyQ7rzk1SWQxAxeCWeeE6vL5aSONfCowxugYDIK2qGs8sq3IertfSeXnPLMIp88AKQI56zzzjz37PPPQAfNp8Msm1xy0Sjr6rMGARRQgtMFQP001FIzkEDG55r5cwUGAOD1115zAPbXHISQknZq1tdzBh4AILbYboMNN9wnDPcpTK76/EEIY8vdNwAsUJgvtcz0y7MGF0AA999/GxAeCfUqvbMJKjBuOQcdQAEwnuVI3DMIDPy9uN8rHIBmtiRdaanOG4y++Ntxf13A/gbNgryMvAhr0PXosY9NN3IoKssJrTqTUIDvZMc9NwAGDGVrcHjm6vKlHcDuN+McODAYoXoNcLC6H7jQ+/h/K1Ckp9HTJoio81bwAASiWw6AB0Y8P+QLc/qLggLj8943BykY1FNIMoDpScUEJ5Cf5VbQKedYplDBSEDHbnSAsCXPf2OzwJnStJfGRKdNRiJABDAoPwU0AAlKSt8u2GTAlbSABdeTX+CORIBVpeeG5mnhSu4zAhL2rXTpSmEfFtOL840KSbUagQK/xoLvGQFcQ7zHfl5VIsMRgQQw9KHbTngFDdxNGudJEghHgSJIBEszLyQf2FgwQRhkbB5n7A43/gZAC3Z0gTN8sREBlIjBApShHSTIS2DAkkJZOHERFUiAPfAXRiIQwAP+W0HmtkCeaDRSM5/awwCupsMVJcBZcjIiEV7IOw+IEgvaQN0gI8Sh6GxAAhXQjX1MICAbXslE92HB4grgJDlsLjDygdgLNkmA3ICFCQvozSd9ZR496hIApUtE8PqgoKJsrDB9SEMLGuhGEkjgA6qEyRSLgEUONE8RFbskRwYHk038MUZqCgabjtACB5xyDkXBJXTqFa+E2dJ2YLJRG7EgS0xqjFjvfAaoNDXOGwnRg/O4i0I3Zhf9KMgtIeKnRGEAAlselFWP6aQcWATRAeZpKb7aFkXQxDHQbNgvnuJKKEf/GRCVekNtG+mI7fDxApl29Jqm0Va8cLYQKKkwdTLN1EeFKQmMiBSROglXYWwaqoQp46g2WV2iRLOqaIirp/5kJjAwww8qbqMcSWkMQSxmEXElpKU7RMYiIeLT5YjzA1aclwlyIchy1LVRtBnEJ+DKp70OSC9JPUo0pkPYVzUiGeDoUF0XJjK8llVoQ7ADHjAUCZ8yhRAfaMFkMMuQLnwhDAO4jRlKJgY2ZIA6pN0CE3hToSZMoaBGCgIAIfkECQYAMwAsAAAAAGQAZACFJCYknJqcZGJkzM7MREJE7OrstLa0fH58NDY03N7cVFJUrKqsbG5s9Pb0xMLEjIqMLC4s1NbUTEpMpKKkbGps9PL0vL68hIaEPD485ObkXFpctLK0dHZ0/P78zMrMlJKULCosZGZk1NLUREZE7O7svLq8hIKEPDo85OLkVFZUrK6sdHJ0/Pr8xMbEjI6MNDI03NrcTE5MpKak////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv7AmXBILBqPyGKnw2o0WMqKk7VMWq/YrNbKIhVQCZGoBStWPJ5BBIYqkKDbuHxubBRgg4HDst9HzC18fQ5pCQUNdImKRkwFES19fJIODn9EFZAWkpp9LRGHHYuiW10wgZGomhaWQ5ior3wtCW+jtUcdjpCRk7yVgKnAsZ+htrUdJGOUnL29rEKYzMGULSIkxMV0HRUiu8rSfCXOM66bqbyTIg3X2FlMKJmDy9++l/DR9xYeKOrsWRV694LxEkeuW0BeIir0s4LLnsF5fAieYlauYiQPGdYtFNIAhreDAv38ihZP0Lk+MBBtFNIhwx6QMCW+xGcOWLqVHLlVpDhP5v5JmvdEwFnZIEI8iMDCmflYUx5PPhlxCmEhQhVSi6sAgQxZYhAKjbWo1DG6qVxXmj6Rnn34tV8DEVGJaNPJFCa9Vg8P9nLQVomot5T6Ein6MmS0tOAcrE3sVLGDDEcqZFCZzaOmFoKHsAB4lZCaAkUaoBDjodfZgHzBEoYBVksBVJiPAJ5UgpkHQ1LEKmlSoUCC0oVRoxiqmawD0HK0TRwUd0gHwpMKk3nTOgmVChE8QGzOEvoeDxWqI3l7TtDwsY453Q6/SNvvmnxl05V0U0uHd7D2YFZd9TsM9sZUYMormU3V3zJ8FJhEA6X9pB9kSpA3QAHE2dKFdoIkoJpx0f7lQxlDHEqTmhEscNdPBx49xshs5mgSgXhDkNBUN5hVKJVzGZg4A1UiUuIACVdQZddlKNyIRBVFCPlQbaoIlURDnfWho5G7zWcSLC0UUB0LETgFFCVTUpnTl8tEYKMQMnY2SQthUskjVsFF0gKQjMDwk4OSwHCmmDMU0CEse7FWh0PwyeMBjFR2MMBOcZ7TwodC+AkRJ4PQyScSFVyV2B7IEXHgjBXpeal1CcxzWmEihOYQapqAN6oVZ2zFy6NEuGRXV5Ro+OqTpeql2CQQzoCimq0qtOuCwMlKyYtTcTakoMceaWejTVlQHwnJolJbMMZGi4SMVy4GjAd0vjbkd/57ersjQOdCdt+5fECrbp3wOqAhC9OC1FVXWs57i7mmFqankOe20K2/RWDLKJzpNMCuYX0MkO685NUlkMQMXglnnhOry+WkjjnwqMMetGByC9qhrPLKtyHq7X0nl5zyzCKfPACkCOes88489+zzz0AHzafDLJtcctEo6+ozzEc3bfTTKN+c8blm/vzxxnGOrJ2a9fW8GVKRpKPkkK76HCvIfIidL7XM9MszLvBaoOe7atrr8q4d9KpmWwDjWY7EXi/KNrXIKTzPUZbqnOm5Ihv7ta/LyItwByHeOVN9KCrLCa06s5CJXXvIa2tweOZ6N58odLZtfEM0QKheAxys7v7Zpc8K6aeN0SaIqPOykABMvaRaxOhDWjCnvySsqq05wba+3MKvDHA6Th3grm00Ldg4LE/fJNDxjZJCLnBrae6VO3PTLzQ2SYxRkjgRY+dlDpvpL8RiWWw7+a/ya4k74sv3UwajHiOe+LWvMUV6FQtsBJ3z0QdR4OrDtpixn1dVQAULYKD1Dvi+W2wQGOdJUpvCYgIEIGABK/rUBB+YhYzNo3nd4cYAaMEOTKQAADh8wQRkt6PKvcQDODtS6uD0P/gdSBY8XEQELnACAIAAhwA4wQ7rgDvzTI880QihETs0gATwQxF5+4ACnohDMgIAAROQzzm61g7aeUUjz+FQdP48EIEK6EYLXRDBAQhARjNCEQQQyGCEOASe+vWJQPKBmAW6WIDcgEUbKIiAAVyQAjP6EYplRCMPvQPDLWSuDwoqCtYoxYc0wKBTQsjAB1YgAAk88ZWYjGUspYgzwEhODhXTYuvWBryXlIEIA0CALIf5R1meMDKT+UsETBTHwYHkl0PwgDBhSUwnFhOTOsSZIY9wR830p26bgKYQpHnJWPrRkpiUYhLVV8W63UUIwSQmOtFpTShKcZu49GG9xOGBJpaznpgspxlfsAB8auF+xZtJ6IogTXMC9J/ypAAq2dEScEoQFeKcATnlWU2HgkAACSSKZb4xSk1ktKEASCk1U9PK0pa6VKUmCCn1CrAqxsmNoQiA6Et36kQCbGCdG9lGYS7KiQka5KTCZOlKedrSj3pgVM/BT+3SEwmk6pSpKSVAAHTJJxZsoxxJaQw/kwpQrKqUAglR1zGSMcqq4tSsLz0BBRwAVAXmQn7lOGkTVVpWl55gBSWYKMJYcAflnQOpcI3iA44TtEaw9VfxsCpflfoCuW6gkUILzR0GgCG3EgGlKgWBBARgggXINLOM6MIXwsDZBBRBBDEggAYo8IAJbMADFEKtJxfYADuGBgZsaOT32BEEACH5BAkGADEALAAAAABkAGQAhSQmJJyanGRiZMzOzHx+fOzq7ERCRLS2tHRydNze3Dw6PIyKjPT29FRSVMTCxKyqrCwuLGxqbNTW1ISGhPTy9ExKTLy+vHx6fOTm5JSSlPz+/FxaXMzKzLSytCwqLKSipGRmZNTS1ISChOzu7ERGRLy6vHR2dOTi5Dw+PIyOjPz6/FRWVMTGxKyurDQyNGxubNza3P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb+wJhwSCwaj8iiRqNiMFRKilO1TFqv2KzWqhoVTolQiAUrUjicgQR2Koyg27h8bmQUYIOBw7LfS8wsfH0OaQkFDHSJikZMBRIsfXySDg5/RBSQFpKafSwShxqLoltdMIGRqJoWlkOYqK98LAlvo7VHGo6QkZO8lYCpwLGfoba1GiNjlJy9vaxCmMzBlCwhI8TFdBoUIbvK0nwlzjGum6m8kyEM19hZTCeZg8vfvpfw0fcWHCfq7FkUeveC8RJHrltAXiEo9LOCy57BeXwInmJWrmIkDhjWLRTCAIa3gwL9/IoWT9C5PjAQbRSiAcMekDAlvsRnDli6lRy5VaQ4T+b+SZr3QsBZyUBCPIjAwpn5WFMeTz4ZcQpREUIVUourAIEMWWLQCY21qNQxuqlcV5o+kZ59+LUfgxBRiWjTyRQmvVYPD/Zy0FaJqLeU+hIp+jJktLTgHKxN7FSxAwxHKGBQmc2jJhaCh6gAeJWQmgJFGJwQw6HX2YB8wRKGAVZLAVSYjwCeVIIZB0NSxCppQqFAgtKFUZ8YqpmsA9BytE0cFHeIBsKTCpN50zoJFQoSOEBszhL6Hg4UqiN5e07Q8LGOOd0Ov0jb75p8ZdOVdFOLhnew9mBWXfU7DPbGUGDKK5lN1d8yfBSYBAOl/aQfZEqQN0ABxNnShXaCJKCacdH+5UMZQxxKk5oRKnDXjwYePcbIbOZoIoF4Q4zQVDeYVSiVcxiYGANVIlLiwAhXUGXXZSfciEQVRQj5UG2qCJVEQ531oaORu81nEiwsFFCdChI4BRQlU1KZ05fLSGCjEDJ2NgkLYVLJI1bBRcICkIzA8JODksBwppgxFNAhLHuxVodD8MnDAYxUajDATnGew8KHQvgJESeD0MknEhRcldgeyBFx4IwV6XmpdQnMc1phIYTmEGqagDeqFWdsxcujRLhkV1eUaPjqk6XqpdgkEMaAopqtKrTrgsDJSsmLU3E2pKDHHmlno01ZUN8IyaJSWzDGRouEjFcuBgwHdL425Hf+e3q7I0DnQnbfuXxAq26d8DqgoQrTgtRVV1rOe4u5phamp5DnstCtv0Vgyyic6TDArmF9DJDuvOTVJZDEDF4JZ54Tq8vlpI458KjDHLBgMgvaoazyyrch6u19J5ec8swinzwApAjnrPPOPPfs889AB82nwyybXHLRKOvqM8xHN2300yjfnPG5Zv788cZxjqydmvX1vBlSkaSj5JCu+hwryHyInS+1zPTLMy7wWqDnu2ra6/KuGvSqZlsA41mOxF4vyja1yCk8z1GW6pzpuSIb+7Wvy8iLsAYh3jlTfSgqywmtOquQiV17yGtrcHjmejefJ3S2bXxDMECoXgMcrO7+2aXPCumnjdEmiKjzqpAATL2kWsToQ1owp78jrKqtOcG2vtzCrwxwOk4a4K5tNCzYOCxP3yTQ8Y2SQi5wa2nulTtz0y80NkmMUZI4EWPnZQ6b6S/EYllsO/mv8muJO+LL91MGox4jnvi1rzFFehWS4FcVcGgsbIgCVx+2xYz9vKpEbhuMTkr3vltYLxrnSVgLvteeATWvO5/qX9rulrF5nFBYCYgAAFZgsH50gTN8sdHVgME5LNxHfv8jwgle4AEAAEABCxCeLSiQAHsYL4QaLMzqFLSgBgIDikMoAAKKaMQiNiADSkvEcxLgLDklMDQbfEnX2kE7r2jkPi+AgBH+59hFA1wgdjhjiAoEpLwrmeg58wFP/fpEoCMkgIh0nCMXAeCBFaSgBCE4gTUYwRvfCO5LOUQPVMS4NgUVIAJcXGQiF+mBCggAAQdIUgJgEALg1M2CaHSA5ORQMSyiyQSJzOUo6UiApVjlfKh5YQxEk8c4FOWPhwxlLkW5zAskTBdPqZYgMKC9sIBliMxUpC5z6cxL1O1KZhxkIgqASEZus4joNCcdRZAwAX4zOLDECQa2eE51btOc3cTLA+v1IHFuIZn31KUyF5nPZ0CME+JCUB/0txANPECZdExnNnVZ0HEI8E9kWmgxi3ECEbhglwEVaEUX95FoOiglRmJABwy5IFB7BtQDI40TqNKzJgrxaQAC+KhLQ0rHmJJucPLoSjVGdZ8AsLSLPE1kTPeJFMzw41VvAWVSubkUtqEmISSUigocEAEFTPSeS1WLfkKQwXlRoAQIUMBUARDWaFBQZJ/I6qheswCv8tSnteMADGwKNBUUoANddcFX28pDsj5VaEM4wQNEIAADCLanVbWKZ2BATcRyoQAc6MAHFhCBDRhgAWYomRjYgAEK6MayWdjjF/aaJArkZoFUCgIAIfkECQYAMQAsAAAAAGQAZACFJCYklJaUzM7MXF5cREJE7OrstLK0fHp8NDY03N7cpKakVFJU9Pb0xMLEjIqMbGpsLC4s1NbUnJ6cZGZkTEpM9PL0vLq8hIKEPD485ObkrK6sXFpc/P78zMrMlJKULCosnJqc1NLUZGJkREZE7O7sPDo85OLkrKqsVFZU/Pr8xMbEjI6MbG5sNDI03NrcvL68hIaE////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv7AmHBILBqPyCKHk2IwUsqKM7VMWq/YrNaaIhVMiVBI5SpWOh1BxGUqkKDbuHxuZBRcAkHjtd9HzCp8fQ1pCQUMdImKRkwFESp9fJINDX9EFZAvkpp9KhGHHIuiW10ugZGomi+WQ5ior3wqCW+jtUccjpCRk7yVgKnAsZ+htrUcJGOUnL29rEKYzMGUKiEkxMV0HBUhu8rSfBbOMa6bqbyTIQzX2FlMJpmDy9++l/DR9y8dJursWRV694LxEkeuW0BeISr0s4LLnsF5fAieYlauYqQOGdYtFMLAhbeDAv38ihZP0Lk+LhBtFMIhwx6QMCW+xGcOWLqVHLlVpDhP5v5JmvdCwFnJIEI8iMDCmflYUx5PPhlxCkkRQhVSi6sAgQxpYZAJjbWo1DG6qVxXmj6Rnn34tR+DEFGJaNPJFCa9Vg8P9mrQVomot5T6Ein6MmS0tOAarE3sVHGDDEcqZFCZzaMmFYKHpAB4lZCaAkUYmBDTodfZgHzBEnYBVksBVJiPAJ5kgVkHQ1LEKmlSoUCC0oVRmxiqmWwD0HK0TRwUdwgHwpMKk3nTOgmVChE6QGzOEvqeDhWqI3l7TtDwsY453Q6/SNvvmnxl05V0UwuHd7D2YFZd9bsL9sZUYMormU3V3zJ8FJgEA6X9pB9kSpAnQAHE2dKFdoIkoJpx0f7lQxlDHEqTmhEpcNcPBx49xshs5mgSgXhDkNBUN5hVKJVzGZgYA1UiUtIACVdQZddlJtyIRBVFCPlQbaoIlURDnfWho5G7zWcSLCoUUF0KETgFFCVTUpnTl8tEYKMQMnY2iQphUskjVsFFogKQjLjwk4OSuHCmmDEU0CEse7FWh0PwydMBjFRyIMBOcZ6jwodC+AkRJ4PQyScSFVyV2B7IEXHgjBXpeal1CcxzWmEhhOYQapqAN6oVZ2zFy6NEuGRXV5Ro+OqTpeql2CQQxoCimq0qtOuCwMlKyYtTcTakoMceaWejTb1QHwnJolJbMMZGi4SMVy4GTAd0vjbkd/57ersjQOdCdt+5fECrbp3wNqBhCtOC1FVXWs57i7mmFqankOeq0K2/RWDLKJzpMMCuYX0IkO685NUlkMQMXglnnhOry+WkjjXwqMMdqGCyCtqhrPLKtyHq7X0nl5zyzCKfLACkCOes88489+zzz0AHzWcCCxCAgdEEIH000kwH4HK0MJfMsslSV32zCyMA8AEAXHe9dddgH3Dwzh9vHOejJqDgNddfs+02ACIEy3PFrL6UTgEPaA3223t/QEGqPsdKLVZCVXDB3ogj/oEFT7+KS70DB9B24ok70PGxKSTQ2EG6GtBC32vr3fUCYyO8mZqUINdB1qF/3bbrHfQMrv6aBkc6wOSJ435A43yi+BThKqVwwNpbFw+28QQUqXPG1ErDrBAKfE658cd7wDuVJtwKLBEmlBA65W4vALi/gj+VCq1ETHA8+Mc7UPqu+OYl//hDnIA7+123oIK/JCynqdxCyID3RIc/vW3gcjc6XV7gpAIbpeBwBazc+/gkKfOdRF5EaMAA7zc9ALRAAwhciZI21w39dKoIBWBBBPvWghOEkCif4gmq9sQBA3iPg9NTwAtXwoQYFiZOjxFPBUSwQq6VAATwA0vZTIMKJ1mhAdRjXwtAMEGppKAAOpoNno6DhRSoEIdeoyKJKISTYakoQlbqRgieZgIC4K+FJNoGIf5owY4ucIYvNvJOL9DXRRC0AIdHtJGAXtKB/2CjAgmwxwtqRCIfJoh3GSDi/aZYOh4tRgAJ4IcinpMAZ8lJeaH5VFfqY58QuHFvLVDA2OYijQ5EoAK6sU8KBLSqo5ioh9IBUBw817YpRoYblBDXJDBZgNyAhQkM6E0nfWWePBoHgKQ43NaOWElgbos24xKAC04YA9FEIATZGtJ+6sANDMrBBJIUY5KAOaRNlIEIs6uXJNgUmcmIwgQPcGEUrAmqaLwzRrWESXQyYKPrJYGM67SYxhT6TzQth4R6GaeR3jQ4POVpKYOL0iIV5BayLPRc4kiTPPPTplqwCEHpuUpDx88Bsmu2qA9OXEhLUIfNZay0fzT91VFIuZGOMGUxAr3LM+QXDXFtKyVGghJjqhWMmz4UZOXAiEFFIUcvpaemhSFIXeQhzCZaSkzPwY8MwcEMp+7FbJK4jSZHNcv5lCSl8tAqxKKRkB1u5BhjwKo8ImHWXQgCqPoJQb9Ml4uMxnUpvtLPNu0qpiu6IJxNTVhAYbPYoDUiGWRFhVZNM0/BrlVoHMmAC8CZCqfGqQMhcAFBQcuQLnwhDAK4jRlKJgY2ZEAKU7VsCnhTId48AUliCgIAIfkECQYAMQAsAAAAAGQAZACFJCYklJaUzM7MZGJktLK07OrsfH58REJENDY0pKak3N7cdHJ0xMLE9Pb0jIqMLC4snJ6c1NbUbGpsVFJUvL689PL0hIaEPD48rK6s5ObkfHp8zMrM/P78LCosnJqc1NLUZGZktLa07O7shIKETEpMPDo8rKqs5OLkdHZ0xMbE/Pr8lJKUNDI0pKKk3NrcbG5sVFZU////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv7AmHBILBqPyCKHo2o0VMqKU7VMWq/YrNaqEhVOis8n5SpWNhtBxHUqiKDbuHxubBRcAgGDst9HzCl8fQxpCgUNdImKRkwFESl9fJIMDH9EFZAUkpp9KRGHHIuiW10ugZGomhSWQ5ior3wpCm+jtUccjpCRk7yVgKnAsZ+htrUcImOUnL29rEKYzMGUKR8ixMV0HBUfu8rSks4xrpupvJMfDdfYWUwnmYPL376X79H2FBsn6etZFXr2wXiFG9cNIK8PFfhZwVWvoDw+A08xI0cx0oYM6hQKaeDCm8GAfn5FgyfIXB8XiDQK4ZBhz8eXEV3eKwcMncqN3ChOlBfT5P5Mex/gqGwQAd7DYAM90oy3kw/Gm0JUfFB1tOIqQB9BTmJwImMta3WKbrIKsmfVpVy9jjohwURGbTmVvpzXyqHBXmkZiToBAgALCCmJqIjA1G4qsy+jnTjSIEPgOQ0sdAAA4EKLhEWkzpWUxkWGzAoifNjwE1jeIg24uVCbJQQLypNLtGA81S5nFwUqVKDCSIXuO6RdyuMqdMjgPgXmcPhwgLJzvwmKx+BAVDg5Bi7esEbCpEKEDQ+7KqnOucL2Ixn6Api8njKCy2Ff5TO/SJsC8Ca50k5lU4sKCK+x91wHsj0WVW18uLCbLdp09MoJ0sWgmXUUpCBeFgqQ8NyG7v6ZwEhqFAiw4Dpd4EeJAl6RB8sGBiKhwgIcctjBAy20qEIGEWLDgYOfjReXOZpEcJ4QDDwQo4DOyYYZVIxk8FRmP75CCQMiXFFBX0iyNxmSJUDAJHdeTWiVKhQElQQHBCAQ45qUsWBCjl8SwcSPJcGSQgGsFfDCls7xyWd7HQ7JJIjWGVYmnAyUwOaAG5bwZpwuIviQJClUWYcFRwK6IXsjLAlpES35tEsvqxmRgaKLHjmBp5/K+c9wvKQQIQaatockhyww0GoSBTRUGgXJFSHBpqmu1+muLna0WR8fFKHABZmyOUGzyCJxxq+RpPCYCQ8IeOuRK8BZLQcnTEqVU/7GGfDtt88dUEa1SVxb6Fbe7FFqDAUMwGixGogL7453ncuAAHBs0Ny+bHawAbxXFCCXaZxZmqaMi67KMBcmkrUMH8n9h/CiDrB6sZzKwtpHVxUYUCu7fRLgL8O4FGaQCyoUMGyxz5FA7cjWZvwNJ+icAAOgLD83wGI8R5qYMgI0kCGxiy4gctJRiWUuIRW4AMMBB5TQ9ddchy12uFTfUu4GKaQNXgprg+f2wC2WLffcdNdt99145633Og0IwLbagP8t+AYo3k3u4IGjPXjTDZC2bAQvX3ycxoVq2/jDQMVNtQqvAhQJOmJWtcHUVMt7F7NPuCCqPXjWHfNZmtBM7v6yfBRONwcKwL6HeA43ReHAkVfLOeWFBStCcJ7XaencFejOQAqYcT6pdfeWzYHVTY3VH8Amc6Lt3CpkMpe914T6O1kM2E51uZsJgvRGDU0qYtmmG5qtgZLK3A12wX+pggJLO4epdKeJSiVNBL6aVI+I0ACJFGQkAhAUk5YTMLxEaEcg+Ub1qlWArDBjg0MQwcPm9YonCQ9B2dvK8qDku4mkwITVSk058KIKM92iV867EMxkuBVRMaB1SvsZKt7XqiqwkHgMsGESRLi6IUqQHzcCIgNz4hNBBGsh+ZMGhIxwoycmYkeQWOAQqJPFkpRJgo2r4sk+xA0B0IJEIngVcf64iD2ZYE0L5IIYJXRoHATJgnSJqIAC6lGhLaKGik7cAojyY0jBSGoPAlDAPhRBHQV0LltEHAIPN9EfPJpuEnycjoriQYgI7MaL0/GNKaTRBxiK8kejQ6UQeueNTOJEK5A0hBR4o4QmVKAAljyd+yKkoivKgXt8CKWEUJhBPnTGmDFowAlEgzzYWShFqukfbZIZocHQbhPvCiEBU/HCI1RAH6JIjSvJOE5BIAZ2W8GRXkbBS0fSLhXhFAITSdi+a8YpdN+0VxEQKEQP+hMqo5zeBweaQE6cpZWylENCkWiVfIpDofc4hzaVY757UsSiBBVYAL3RSY1w5IEo3UlS6qrk0QRpbh0MweVHVgrPblxko6PYRqHQslAihFSNlKvGrqjjDvup1AxGSZ5FJBlRW/gmShMpDE1b2AuE4FQhxxiD7/DJ0POx8gMFuOpNalYUfnYDpLDwIVjF6j8RuMBxP7No8/aHl+yw9VON4IYyNkaJqdpREGCd5N42cofRGCUcCLxOZ+Q5WO40oAIZOIELPiCADci1sgL4ABsycMrG4pEJj5WOb3ZpREgFAQAh+QQJBgAwACwAAAAAZABkAIUkJiScmpxkYmTMzsxEQkTs6uy0trSEgoR0cnTc3txUUlQ8Ojz09vTEwsSsqqwsLixsamzU1tRMSkyUkpSkoqT08vS8vryMiox8enzk5uRcWlz8/vzMyswsKixkZmTU0tRERkTs7uy8uryEhoR0dnTk4uRUVlQ8Pjz8+vzExsS0srQ0MjRsbmzc2txMTkykpqT///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kCYcEgsGo/I4oYRyrQySoYUtdkkr9isdnsNDVSUC0sjORQrHM7gkygVQiiufE4/llQjgWQF6PcRZykWDQ2DDWoJBQx1jI1GKAUGLCd8fgAdlwCARBUphYUWoZ8pEYpWjqhbIQ0jIJl9mJZ/gYOGn4aDKQlwqb1HDCIkJ6/EspqBt7W1tw2kBae+qSgNEMOxxtibQ53LuKDMzR8h0NF0KBEQsdfYxtpCnczK8cwfDOTlWRslAQTsxpgAZ3Hy1G1et1ocElDBp+WDhwewivlZJ8sdDHgFMxps8KECwysoDPSjKOtawIAWK2yUJyqjBQ4Z7n2EUeLAA5PY1PlLSbCB/oiC80TMa9Bi0UwhG15AjPjP38RjA79pdCl1UL2jQlpAkNjUKdRthKauNPghDtYSCEgG9OqH50qWYxvExCokAwuST712SJms7yeDBUvIlCazRLqIa9l+fRcW8DehLX0aKmG2HIMPc4mg0IpX8eKLYTWOhdxAsJHBci4TMl0kA4K8nj9j7DsVKBQjFTIYrbOhBagUrIkU2Bq7gwQNCFQU2RzhA4d4YpcFH8IgAlHUWQowA35EK1dLHRRcUPHBTeUhG1AwqFAgwfPofyk/sj6oAJ0N3MBlRm8YbwcCGHBQgEdcpBdCCz1NtR9S1d3CQQXY/fLBQZOdJ8Rw6xg3QQsW/s6hXgkcFPRTaRLGc9UW+iTYmAXAFSZAB5gscEBZvqBQAYLbTScEChNWVVqERDAQ4kG3pHAbEb29qEADBJYDyQDxdXjOUC/tdsUG9MWlIwwFUNChk76RGEWPFBYSAZAwrEIkkcB9SRcMG2SwoBCqtbTMXyFgwSN8ynD35hFVzPdXmaHQiMQGBago1idz/nkaj7QNOsozSJwT2aWRyoUmXXU6powFhhqxylgaGbnpUZDCJRoheZ7Wwppr3sKho0kUoCp0oAzSgkwMqIirVIecitUGIeIqVgpWXsinKHjSioVKpPqUjH1FkGksbbM6mwQKCUSn6gdF9BotLi81qS0S/hUMAF88yBKRwbjSEpKAsH9ukMBo8hByZG/whlLuuVkIeStVZ+4IJZ+y0utobwiTdmIIxYo4lbkAJ6FmpJi+1Kp2CCPkZsWaHSypN/LYp0/Hn+wKMhb8qjqVYJs1LC2lKyeBaMYrcbgnyilQXDNuEQO7ZlkMHFwbMwN8/DMMl6FswQBSFHttN9kufcSU3kp2iBQDcJDC1yk8F/bYZCeksLb2lh32IWM/53UKA/hs9dx012333XjnrffeSxet9t9vm613ioF/XXjZUAuMcgRK/4y10JEiK+SKpJ6INwoiL1pLPXv2+6DeaCz7CeevYmwQzXbf3K8FHJ7cbwPz4m3v/usWmMbx1PIkfbm6kN9KLcTretOq3Sqh3AyBmJPKksp1Y/lWVaAaxXBc8rRbNwoEIVwI8zC8y1KshsROdwnwjigmnb56GzfdoU/NbrLW4jyI+VXXzK3oy4DbGu0sDl9zCIpiBmmUcSTqCMJYohnA2RiygfgJsFQdatmvpqKQmtlKeX3hHhFGBRT56WuB0egczj5Bmgb4TzMO9GAoTFWzTn2qd6FSQqKCQkJwbOlcS/gAOOz0DU1ty4EDDEzFArWcCc2PZLf4AJAudkSDtAhgKMgA6qijw0sV5ISASuE85LOcRpWjN54oIIOsRZoRKVELAhuLGOGkmgHwAh8o8EKU/gRVqmTZjHy3+tEjyKQLuTWiAglIEIu4GKQqNlGPW2iaRgg5BBGGZQAJsIcjlpCAzBWpBCWyk+W0gJ+gTeYeS8hSZA4RgQospEA2wpFoBjGnHDoIQnS43WQyOTVIDogBp0SSethTyaxVyAgNYiUjpjeILVVnYD0chBpaQC3qlKA5nhzXE8OlQw3OoWml6RADStcxZbSgCEykXSGM9IsS2PGaEWhlMJ2WMnAGEH/6imAvctnIHokzFN/khPuWNc03OVKFQ4nAGUwHUFz08yjBvOcnBLrBdyJRcz5EaBV756mW5BMsWRuRS/LXuEl6T5wDJIo7QXonq5zTMr7xZW1YvedOZIrogUQ5KT4QpSjjsVSfD/WUVGACQkZUwJCNgUwT13RRIXAQfGMRBw4ZUIKa0pBqLX1eqczZU1TYiEw5/UlBGAoWqUorf6b82QZC8AFBkqqoaTpgx1LwgSk6rgARMCtV0ApAoS2jhKXoaMUgocq3oLV4lCtIClrwxsFBoqwkLCld1QoXtpqCb8AsQAu6Fg+6Uu4QH3iCTCGLlDgWoAQJ+EDXEnAGr30gsyXIAByqKjsU7NJC6pkCPf8UBAA7');}</style>"
$('body').append(chart_loading)
window.chart_widget = chart_widget;

// <!---- JQUERY LIVE DATA BIDING TO DIV'S ----->
/*

THIS IS THE JQUERY DATA BINDING WAY TO LOADING A CHART WITHOUT THE USER NEEDEDING TO KNOW ANY JAVASCRIPT
        <div id="my_new_chart"
             data-build="chart"
             data-title="",
             data-url="http://dev/bl2//advertiser/api/get?type=adgroup&action=stats&gid=3820&begin=2012-09-24&end=2013-08-12&plot=clicks&interval=daily", 
             data-chart_type= "bar", 
             data-chart_title= "",
             data-x_axis_title= '', 
             data-x_axis= 'report_date', 
             data-y_axis_title= "", 
             data-series= "[{'name':'clicks','data':'clicks'}]", 
             data-reverse='true'>
        </div>
       // Update your Chart By Changing URL          
       $('#my_new_chart').data('url','http://dev/bl2//advertiser/api/get?type=adgroup&action=stats&gid=3820&begin=2011-09-24&end=2013-08-12&plot=clicks&interval=daily')
       // Refresh Charts By Doing 
        dashboard.charts.refresh() <--- This updates all 
        dashboard.charts.refresh('YOUR DIV ID ') <--- This updates by div 
        dashboard.charts.update('YOUR DIV ID','NEW URL')


*/
$(function(){ 
    var chart_widget_url_cache = {}
    var dashboard ={}
        dashboard.charts ={}
        dashboard.charts.build = function(){
            $("[data-build='chart']").each(function(){
                var chart_options =$(this).data()
                    chart_options.series = eval(chart_options.series)
                    chart_options.id = this.id
                    chart_widget(chart_options)
                    chart_widget_url_cache[chart_options.id] = chart_options.url
            })
        };dashboard.charts.build()
        
        dashboard.charts.update = function(id,url){
            dashboard.charts.build()
        }      

        setInterval(function(){
                        $("[data-build='chart']").each(function(){
                                var chart_options =$(this).data()
                                    chart_options.series = eval(chart_options.series)
                                    chart_options.id = this.id
                              
                                    if(chart_options.url != chart_widget_url_cache[this.id]){
                                              chart_widget(chart_options)
                                              chart_widget_url_cache[chart_options.id] = chart_options.url
                                        }

                                })
            },100)


})
// <!---- JQUERY LIVE DATA BIDING TO DIV'S ----->