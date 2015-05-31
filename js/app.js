function mvc(){
  return {
    modal:function(modal){
      if(modal)
        this.modal = modal
      return this
    },
    view:function(view){
      if(view)
        this.view = view 
      return this
    },
    controller:function(controller){
      if(controller)
        this.controller = controller
      return this
    }
  }
}

$(function() {
  var datePicker = new mvc("datepicker")
  datePicker
  .modal({
    getEmailDateRange:function(){
      return $.getJSON('/api/startAndEnd')
    }
  })
  .view({
    input:$('input[name="daterange"]')
  })
  .controller({
    init:function(){
      datePicker
      .modal
      .getEmailDateRange()
      .done(function(data){
        datePicker.controller.daterangepicker(data[0].start_date,data[0].end_date)
        return datePicker.controller.updateDOMRange(data[0].start_date,data[0].end_date)
      })
    }(),
    daterangepicker:function(start,end){
      return datePicker.view.input.daterangepicker( {
        ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
          'Last 7 Days': [moment().subtract('days', 7), moment().subtract('days', 1)],
          'Last 30 Days': [moment().subtract('days', 30), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        startDate:  moment(start),
        endDate:   moment(end)
      },datePicker.controller.update)
    },
    updateDOMRange:function(start,end){
      return datePicker.view.input.val(start+" - "+end)
    },
    update:function(start,end){
      var start = moment(start).format("YYYY-MM-DD")
      var end = moment(end).format("YYYY-MM-DD")
      dashboard.modal.top({
        startDate:start,
        endDate:end
      }).done(function(data){
        StanFanTech.tools.build_table ( dashboard.view.topEmailTable.selector ,data)
      });
    }
  })
  
});


// define dashboard mvc 
var dashboard = new mvc()

dashboard
.modal({
  top:function(query){
    return $.getJSON("api/top",query)
  }
})
.view({
  topEmailTable:$("#topEmailTable")
})
.controller({
  chart1:new chart_widget({
    title:'', // This give the charts a title 
    id:"chart1", // this tells the chart to render in this id 
    url:'api/count?year=true', // this is the URL that grabs that JSON
    chart_type: "line", // this tells the chart_widget what type of charts
    chart_title: "", // this gives it the high charts title 
    x_axis_title: '', // this is the x-axis title 
    x_axis: 'year', // this tells chart_widget the x-axis is report_date in the json
    colors:['#0098df','#FF4747', '#DDDF00', '#24CBE5', '#64E572',],
    y_axis_title: "", // this gives the y-axis title 
    series: [
    {name:'Emails Received',data:'count'}
    ], // this is the chart seris based off the JSON
    reverse:'' // this reverses the json array incase the dates are one way
  }),
  chart2:new chart_widget({
    title:'', // This give the charts a title 
    id:"chart2", // this tells the chart to render in this id 
    url:'api/count?hour=true', // this is the URL that grabs that JSON
    chart_type: "column", // this tells the chart_widget what type of charts
    chart_title: "", // this gives it the high charts title 
    x_axis_title: '', // this is the x-axis title 
    x_axis: 'hour', // this tells chart_widget the x-axis is report_date in the json
    colors:['#0098df','#FF4747', '#DDDF00', '#24CBE5', '#64E572',],
    y_axis_title: "", // this gives the y-axis title 
    series: [
    {name:'Emails Received',data:'count'},
    ], // this is the chart seris based off the JSON
    reverse:'' // this reverses the json array incase the dates are one way
  }),
  table:function(){
    dashboard.modal.top().done(function(data){
      StanFanTech.tools.build_table ( dashboard.view.topEmailTable.selector ,data)
      $(document).on("click","td.email",function(){
        $('#myModal').modal('show')
        var email = $(this).text()
        new chart_widget({
        title:'', // This give the charts a title 
        id:"emailsByMonth", // this tells the chart to render in this id 
        url:'api/count?month=true&email='+email, // this is the URL that grabs that JSON
        chart_type: "line", // this tells the chart_widget what type of charts
        chart_title: "", // this gives it the high charts title 
        x_axis_title: '', // this is the x-axis title 
        x_axis: 'month', // this tells chart_widget the x-axis is report_date in the json
        colors:['#0098df','#FF4747', '#DDDF00', '#24CBE5', '#64E572',],
        y_axis_title: "", // this gives the y-axis title 
        series: [
        {name:'Emails Received',data:'count'}
        ], // this is the chart seris based off the JSON
        reverse:'' // this reverses the json array incase the dates are one way
        })
        new chart_widget({
        title:'', // This give the charts a title 
        id:"emailsByDay", // this tells the chart to render in this id 
        url:'api/count?hour=true&email='+email, // this is the URL that grabs that JSON
        chart_type: "line", // this tells the chart_widget what type of charts
        chart_title: "", // this gives it the high charts title 
        x_axis_title: '', // this is the x-axis title 
        x_axis: 'hour', // this tells chart_widget the x-axis is report_date in the json
        colors:['#0098df','#FF4747', '#DDDF00', '#24CBE5', '#64E572',],
        y_axis_title: "", // this gives the y-axis title 
        series: [
        {name:'Emails Received',data:'count'}
        ], // this is the chart seris based off the JSON
        reverse:'' // this reverses the json array incase the dates are one way
        }) 
        new chart_widget({
        title:'', // This give the charts a title 
        id:"emailsByYear", // this tells the chart to render in this id 
        url:'api/count?year=true&email='+email, // this is the URL that grabs that JSON
        chart_type: "line", // this tells the chart_widget what type of charts
        chart_title: "", // this gives it the high charts title 
        x_axis_title: '', // this is the x-axis title 
        x_axis: 'year', // this tells chart_widget the x-axis is report_date in the json
        colors:['#0098df','#FF4747', '#DDDF00', '#24CBE5', '#64E572',],
        y_axis_title: "", // this gives the y-axis title 
        series: [
        {name:'Emails Received',data:'count'}
        ], // this is the chart seris based off the JSON
        reverse:'' // this reverses the json array incase the dates are one way
        })

        $("#myModal .modal-title").html(email)
      })
    })
  }()
})
