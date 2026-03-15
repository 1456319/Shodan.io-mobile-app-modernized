import { Component, OnInit } from '@angular/core';
import { NavExtrasService } from '../nav-extras.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-alerts-details',
  templateUrl: './alerts-details.page.html',
  styleUrls: ['./alerts-details.page.scss'],
})
export class AlertsDetailsPage implements OnInit {

  public alert: any;

  constructor(public navExtrasService: NavExtrasService, public api: ApiService) {
    var alertId = navExtrasService.getItem();
    this.api.getNetworkAlertInfo(alertId).then(result => {
      this.alert = result;
    })
  }

  ngOnInit() {
  }

}
