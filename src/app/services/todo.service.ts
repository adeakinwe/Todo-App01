import { Injectable, ApplicationRef } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, interval} from 'rxjs';
import { Todo } from '../models/todo';
import { SwUpdate } from '@angular/service-worker';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  todosLimit = '?_limit=5';
  todosUrl:string = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http:HttpClient, private update: SwUpdate , private appRef: ApplicationRef) { }

  getTodos():Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.todosUrl}${this.todosLimit}`);
  }

  deleteTodo(todo:Todo): Observable<Todo>{
    const url = `${this.todosUrl}/${todo.id}`;
    return this.http.delete<Todo>(url, httpOptions);
  }

  addTodo(todo:Todo):Observable<Todo>{
    return this.http.post<Todo>(this.todosUrl, todo, httpOptions);
  }

  toggleCompleted(todo: Todo):Observable<any>{
    const url = `${this.todosUrl}/${todo.id}`;
    return this.http.put(url, todo, httpOptions)
  }

  updateApp(){
    if(!this.update.isEnabled){
      console.log("Not Enabled");
      return;
    }
    this.update.available.subscribe((event)=>{
      if(confirm("New update is available for this app")){
        this.update.activateUpdate().then(()=>location.reload());
      }
    });

    this.update.activated.subscribe((event)=>{
      console.log(`current, ${event.previous}, available, ${event.current}`)
    })
  }

  checkUpdate(){
    this.appRef.isStable.subscribe((isStable)=>{
      if(isStable){
        const timeInterval = interval(10*3600*1000);

        timeInterval.subscribe(()=>{
          this.update.checkForUpdate().then(()=> console.log('checked'));
          console.log('Update Checked!');
        });
      }
    })
  }
}
