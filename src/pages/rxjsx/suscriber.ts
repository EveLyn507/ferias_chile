import { Subject } from "rxjs";

export class SubjectManager {
    subject= new Subject()


    get  getSubject(){
        return this.subject.asObservable();


    }


    set setSubject(value: string) {
        this.subject.next(value); 
    }
}

