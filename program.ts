/// <reference path="steam-definitions.ts" />
/// <reference path="STEAMStudent.ts" />
/// <reference path="STEAMSession.ts" />

class Program {
  public steamSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
  public sessionsSheet: GoogleAppsScript.Spreadsheet.Range;
  public studentsSheet: GoogleAppsScript.Spreadsheet.Range;
  public communicationDoc: GoogleAppsScript.Document.Document;
  public rosterDoc: GoogleAppsScript.Document.Document;
  public teacherDoc: GoogleAppsScript.Document.Document;
  public tableDoc: GoogleAppsScript.Document.Document;
  public scheduleTable: GoogleAppsScript.Document.Table;
  public sessionTable: GoogleAppsScript.Document.Table;
  public studentTable: GoogleAppsScript.Document.Table;
  public teacherTable: GoogleAppsScript.Document.Table;
  public steamHeader: GoogleAppsScript.Base.Blob;
  public sessions: STEAMSession[];
  public students: STEAMStudent[];

  public main(program: string) { 
    //Create Pages
    if (program == "communications") {
      let docBody = this.communicationDoc.getBody();
      docBody.clear();
      for (let i = 0; i < this.students.length; i++) {
        let student = this.students[i];
        this.createStudentPage(docBody, student);
      }
    }
    if (program == "rosters") {
      let docBody = this.rosterDoc.getBody();
      docBody.clear();
      for (let i = 0; i < this.sessions.length; i++) {
        let session = this.sessions[i];
        this.createRosterPage(docBody, session);
      }
    }
    if (program == "teachers") {
      let docBody = this.teacherDoc.getBody();
      docBody.clear();

    }
  }

  public getSessionById(id: string): STEAMSession {
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].id == id) return this.sessions[i];
    }
    return new STEAMSession("nullID","nullName","",[]);
  }

  public getStudentById(id: string): STEAMStudent {
    for (let i = 0; i < this.students.length; i++) {
      if (this.students[i].id == id) return this.students[i];
    }
    return new STEAMStudent("nullName", "nullID", "", "", "", []);
  }

  public formatDate(date: string, dateFormat: string): string {
    return Utilities.formatDate(new Date(date), "GMT", dateFormat);
  }

  public shortClassName(grade: string, classroom: string): string {
    let initial = classroom.charAt(0);
    if ((grade == "PK" || grade == "K") && initial == "B") initial += classroom.charAt(1);
    return grade + initial;
  }

  public firstLast(name: string): string {
    let names = name.split(",");
    return names[1].trim() + " " + names[0].trim();
  }
  
  public createStudentPage(docBody: GoogleAppsScript.Document.Body, student: STEAMStudent): void {
    let numberOfSessions = student.sessions.length;

    //Header Image
    let steamHeader = docBody.appendImage(this.steamHeader);
    let ratio = steamHeader.getHeight() / steamHeader.getWidth();
    steamHeader.setWidth(HEADERWIDTH);
    steamHeader.setHeight(steamHeader.getWidth() * ratio);
    steamHeader.getParent().asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    //Welcome Title
    let welcome = docBody.appendParagraph("Welcome to STEAM 2020");
    welcome.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    welcome.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    //Student Name and Class
    let studentLine = docBody.appendParagraph(this.firstLast(student.name) + " (" + this.shortClassName(student.grade, student.classroom) + ")");
    studentLine.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    studentLine.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    //Confirmation
    let confirmation = "Your child has been registered for the following session";
    if (numberOfSessions == 2) confirmation += "s";
    confirmation += ":";
    docBody.appendParagraph(confirmation).setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    //Session Name and Dates Table
    let table = docBody.appendTable(this.sessionTable.copy());
    let session1 = this.getSessionById(student.sessions[0]);
    table.replaceText("SESSION1", session1.name).asText().setBold(true);
    table.replaceText("TEACHER1", session1.teacher).asText()
    
    let dates1 = "";
    for (var i = 0; i < session1.dates.length; i++) {
      dates1 += this.formatDate(session1.dates[i], DATEFORMAT);
      if (i != session1.dates.length - 1) dates1 += ", ";
    }
    table.replaceText("DATES1", dates1);

    if (numberOfSessions == 1) {
      table.removeRow(1);
    }
    if (numberOfSessions == 2) {
      let session2 = this.getSessionById(student.sessions[1]);
      table.replaceText("SESSION2", session2.name).asText().setBold(true);
      table.replaceText("TEACHER2", session2.teacher).asText();
      let dates2 = "";
      for (var i = 0; i < session2.dates.length; i++) {
        dates2 += this.formatDate(session2.dates[i], DATEFORMAT);
        if (i != session2.dates.length - 1) dates2 += ", ";
      }
      table.replaceText("DATES2", dates2);
    }

    //Pickup Reminder
    let pickUpTime = "Please arrive in the main lobby by 3:30 each of these days for pick up. Repeated failure to arrive in a timely manner may unfortunately lead to your child being excluded from this offering."
    docBody.appendParagraph(pickUpTime);
    docBody.appendParagraph("\r");

    //Schedule Title
    let scheduleHeader = docBody.appendParagraph("STEAM 2020 Schedule");
    scheduleHeader.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    scheduleHeader.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    //Schedule Subtext
    let scheduleDesc = "(We suggest highlighting your chosen classes and posting on your refrigerator)";
    docBody.appendParagraph(scheduleDesc).setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    //Schedule Table
    docBody.appendTable(this.scheduleTable.copy());

    //Next Page
    docBody.appendPageBreak();
  }

  public createRosterPage(docBody: GoogleAppsScript.Document.Body, session: STEAMSession): void {
    //Header Image
    let steamHeader = docBody.appendImage(this.steamHeader);
    let ratio = steamHeader.getHeight() / steamHeader.getWidth();
    steamHeader.setWidth(HEADERWIDTH);
    steamHeader.setHeight(steamHeader.getWidth() * ratio);
    steamHeader.getParent().asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    let sessionStudents = this.students.filter(function(student: STEAMStudent): boolean {
        return (student.sessions[0] == session.id || student.sessions[1] == session.id);
    })

    let sessionTitle = docBody.appendParagraph(session.id);
    sessionTitle.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    sessionTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    let table = docBody.appendTable(this.studentTable.copy());
    for (let i = 0; i < session.dates.length; i++) {
      table.replaceText("D" + i + "_", this.formatDate(session.dates[i], DATEFORMATNUMBER));
      if (!session.dates[i]) throw "Date not found.";
    }
    for (let i = 0; i < sessionStudents.length; i++) {
      let student = sessionStudents[i];
      table.replaceText("STUDENTS" + i + "_", student.name);
      table.replaceText("C" + i + "_", this.shortClassName(student.grade, student.classroom));
      table.replaceText("PHONE" + i + "_", student.phone);
    }

    while (table.getNumRows() > sessionStudents.length + 1) {
      table.removeRow(sessionStudents.length + 1);
    }

    if (session.dates.length == 4) {
      for (let i = 0; i < table.getNumRows(); i++) {
        let row = table.getRow(i);
        while (row.getNumCells() > 7) {
          row.removeCell(7);
        }
      }
    }

    //Schedule Table
    docBody.appendTable(this.scheduleTable.copy());

    //Next Page
    docBody.appendPageBreak();
  }

  public createTeacherPage(classroom: string, startDate: string): void {
    let sessionStudents = this.students.filter(function(student: STEAMStudent): boolean {
      return student.classroom == classroom;
    });
    for (let i = 0; i < sessionStudents.length; i++) {
      let student = sessionStudents[i];
      if (this.formatDate(this.getSessionById(student.sessions[0]).dates[0], DATEFORMAT) == this.formatDate(startDate, DATEFORMAT)) {
        Logger.log(student.name);
      }
    }
  }

  constructor() {
    this.steamSpreadsheet = SpreadsheetApp.openById(STEAMSPREADSHEETID);
    this.sessionsSheet = this.steamSpreadsheet.getRange(SESSIONSRANGE);
    this.studentsSheet = this.steamSpreadsheet.getRange(STUDENTSRANGE);
    this.communicationDoc = DocumentApp.openById(COMMUNICATIONDOCID);
    this.rosterDoc = DocumentApp.openById(ROSTERDOCID);
    this.tableDoc = DocumentApp.openById(TABLEDOCID);
    let tables = this.tableDoc.getBody().getTables();
    this.scheduleTable = tables[0];
    this.sessionTable = tables[1];
    this.studentTable = tables[2];
    this.teacherTable = tables[3];
    this.steamHeader = DriveApp.getFileById(HEADERIMAGEID).getBlob();
    this.sessions = [];
    this.students = [];

    //Populate Session List
    let sessionsValues = this.sessionsSheet.getValues();
    for (let i = 0; i < sessionsValues.length; i++) {
      let session = STEAMSession.parse(sessionsValues[i])
      this.sessions.push(session);
    }
    //Populate Student List
    let studentsValues = this.studentsSheet.getValues();
    for (let i = 0; i < studentsValues.length; i++) {
      this.students.push(STEAMStudent.parse(studentsValues[i]));
    }
  }
}
