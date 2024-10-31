import { ChangeDetectionStrategy, Component, Signal } from '@angular/core'
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone'
import { Observable, distinctUntilChanged, interval, map, switchMap } from 'rxjs'

import { HttpClient } from '@angular/common/http'
import { toSignal } from '@angular/core/rxjs-interop'
import { MediaService } from './media.service'
import { Monitor } from './monitor'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected monitorOff: Signal<boolean>

  public constructor(
    private http: HttpClient,
    private mediaService: MediaService,
  ) {
    this.monitorOff = toSignal(
      // 1.5s should be enough to be somewhat "recent".
      interval(1500).pipe(
        switchMap((): Observable<Monitor> => this.http.get<Monitor>(`${this.mediaService.getAPIBaseUrl()}/monitor`)),
        map((monitor) => monitor.monitor !== 'On'),
        distinctUntilChanged(),
      ),
      { initialValue: false },
    )
  }
}
