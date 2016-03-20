var val = {};
var completedTask = {};
var deletedTask ={};

$(document).ready(function () {
  $("#taskForm").on("submit", handleSubmit);
  $('.task').on("click", ".complete", handleComplete);
  $('.task').on("click", ".delete", handleDelete);
  receiveData();
});

function handleSubmit (event) {
  event.preventDefault();
  $.each($("#taskForm").serializeArray(),function(index, element){
    val[element.name]= element.value;
  });
  console.log(val);
  //empty the input
  $("#taskForm").find("input[type=text]").val("");
  sendData(val);
}

function sendData (taskData) {
  $.ajax({
    type:'POST',
    url:'/task',
    data:taskData,
    success: receiveData
  });
}

function receiveData () {
  $.ajax({
    type:'GET',
    url:'/task',
    success: appendDom
  });
}
//append the object and delete button to DOM
function appendDom(response){
  $('.task').empty();
  response.forEach(function(task){
    $('.task').append('<div class= "'+task.task_name+'"></div>');
    var $el = $('.task').children().last();
    $el.append('<h2>' + "Task content: " + task.task_name + '</h2>');
    $el.append('<h2>' + task.task_status + '</h2>');

    if (task.task_status == "completed"){

      $('.'+task.task_name).addClass("highlight");

    }else{
    $el.append('<button class = "complete"> complete </button>');
    $el.append('<button class = "delete"> delete </button>');
    var eachTask = task.task_name;
    $el.find('.complete').data("taskCompleted", eachTask);
    $el.find('.delete').data("taskDeleted", eachTask);
    }

  })
}

function handleComplete (){
  completedTask.task = $(this).data("taskCompleted");
  console.log(completedTask);
  updateData(completedTask);
}

function updateData(newData){
  $.ajax({
    type:'PUT',
    url:'/task',
    data: newData,
    success: receiveData
  });
}


function handleDelete (){
console.log("it works");
deletedTask.task = $(this).data("taskDeleted");
alert("Are you sure?");
$(this).parent().remove();
deleteData(deletedTask);
}

function deleteData(deletedData){
  $.ajax({
    type:'DELETE',
    url:'/task',
    data: deletedData,
    success: receiveData
  });

}
