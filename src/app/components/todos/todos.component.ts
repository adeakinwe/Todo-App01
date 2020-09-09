import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/Todo';
import { TodoService } from '../../services/todo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  title: string = "Todos"
  todos:Todo[];

  constructor(private todoService:TodoService, private sb: MatSnackBar) { }

  ngOnInit() {
    // if(!navigator.onLine){
    //   alert("please check your internet connection")
    // }

    addEventListener('offline', (e) => {
      this.sb.open("Please check your internet connection",'', {
        duration:7000
      });
    });

    addEventListener('online', (e) => {
      this.sb.open("You are now online", "", {
        duration:3000
      });
    })

   this.todoService.getTodos().subscribe(todos => {
     this.todos = todos;
   });

   this.todoService.checkUpdate();
   this.todoService.updateApp();
  }

  deleteTodo(todo:Todo){
    //delete from UI
    this.todos = this.todos.filter( t => t.id !== todo.id);
    //delete from remote server
    this.todoService.deleteTodo(todo).subscribe();
  }

  addTodo(todo:Todo){
    this.todoService.addTodo(todo).subscribe(todo => {
      this.todos.push(todo);
    })
  }

}
