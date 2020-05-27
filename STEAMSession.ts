/// <reference path="steam-definitions.ts" />

class STEAMSession {
  public id: string;
  public name: string;
  public teacher: string;
  public dates: string[];
  constructor(id: string, name: string, teacher: string, dates: string[]) {
    this.id = id;
    this.name = name;
    this.teacher = teacher;
    this.dates = dates;
  }
  public static parse(row: string[]): STEAMSession {
    let id = row[SESSIONID];
    let name = row[SESSIONNAME];
    let teacher = row[SESSIONTEACHER];
    let dates = [];
    for (let i = SESSIONDATES; i < row.length; i++) {
      if (row[i] != "")
        dates.push(row[i]);
    }
    return new STEAMSession(id, name, teacher, dates);
  }
}
