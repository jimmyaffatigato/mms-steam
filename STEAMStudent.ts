/// <reference path="steam-definitions.ts" />

class STEAMStudent {
  public name: string;
  public id: string;
  public phone: string;
  public grade: string;
  public classroom: string;
  public sessions: string[];
  constructor(name: string, id: string, phone: string, grade: string, classroom: string, sessions: string[]) {
    this.name = name;
    this.id = id;
    this.phone = phone;
    this.grade = grade;
    this.classroom = classroom;
    this.sessions = sessions;
  }
  public static parse(row: string[]): STEAMStudent {
    let name = row[STUDENTNAME];
    let id = row[STUDENTID];
    let phone = row[STUDENTPHONE];
    let grade = row[STUDENTGRADE];
    let classroom = row[STUDENTCLASS];
    let session1 = row[STUDENTSESSION1];
    let session2 = row[STUDENTSESSION2];
    let sessions = [];
    sessions.push(session1);
    if (session2)
      sessions.push(session2);
    let student = new STEAMStudent(name, id, phone, grade, classroom, sessions);
    return student;
  }
}
