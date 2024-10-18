import { Subject } from "rxjs";

export class SubjectManager {
    subject= new Subject<number>();


    getSubject(){
        return this.subject.asObservable();


    }


    setSubject(value: number) {
        this.subject.next(value); 
    }
}

