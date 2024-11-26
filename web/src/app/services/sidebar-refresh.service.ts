import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarRefreshService {
  private refreshSidebarSource = new Subject<void>();

  // Observable for other components to subscribe
  refreshSidebar$ = this.refreshSidebarSource.asObservable();

  // Method to trigger a refresh event
  triggerSidebarRefresh(): void {
    this.refreshSidebarSource.next();
  }
}
