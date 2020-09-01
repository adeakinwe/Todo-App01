import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/Todo';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  title: string = "Todos"
  todos:Todo[];

  constructor(private todoService:TodoService) { }

  ngOnInit() {
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
