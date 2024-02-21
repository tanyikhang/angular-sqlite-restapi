import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.css']
})
export class NoteDetailsComponent {
  noteId: string = ''; // Stores the ID of the current note
  notes: any[] = []; // Stores the details of the current note

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.noteId = params['id']; // Extract the noteId from route parameters
      this.searchNoteById(this.noteId); // Fetch note details based on the extracted noteId
    });
  }

  readonly APIUrl = "http://localhost:5038/api/todoapp/";

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }


  deleteNotes(id: any) {
    console.log('Deleted:', id);
    this.http.delete(`http://localhost:5038/api/todoapp/DeleteNote/${id}`).subscribe((data: any) => {
      alert(data);
      // Refresh notes after deletion
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/']);
      });
    });
    location.reload();
  }

  updateNotes(id: any, newDescription: string) {
    console.log('Updated:', id);
    const formData = new FormData();
    formData.append("description", newDescription);
    this.http.put(`http://localhost:5038/api/todoapp/UpdateNote/${id}`, formData).subscribe((data: any) => {
      alert(data.message);
      // Refresh notes after update
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/']);
      });
    });
    location.reload();
  }

  searchNoteById(noteId: string) {
    // Use HttpClient to fetch note details based on noteId
    this.http.get(`http://localhost:5038/api/todoapp/GetNoteById/${noteId}`).subscribe((data: any) => {
      // Handle the response data
      if (Array.isArray(data)) {
        // If the response data is already an array, assign it directly to this.notes
        this.notes = data;
      } else {
        // If the response data is an object, wrap it in an array before assigning it to this.notes
        this.notes = [data];
      }
      console.log('Note details:', data);
    },
      (error) => {
        console.log('No data found');
      });
  }

  closeNoteDetails(): void {
    // Navigate back to the main page
    this.router.navigate(['/']);
  }
}