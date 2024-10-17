import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RouterTestingModule } from '@angular/router/testing'
import { IonicModule } from '@ionic/angular'
import { PlayerPage } from './player.page'

describe('PlayerPage', () => {
  let component: PlayerPage
  let fixture: ComponentFixture<PlayerPage>
  let httpClient: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), RouterTestingModule, PlayerPage],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents()

    httpClient = TestBed.inject(HttpTestingController)

    fixture = TestBed.createComponent(PlayerPage)
    component = fixture.componentInstance
    component.media = {
      type: '',
      category: '',
    }
    fixture.detectChanges()
  })

  it('should create', () => {
    httpClient.expectOne('http://localhost:8200/api/sonos')
    expect(component).toBeTruthy()
  })
})
