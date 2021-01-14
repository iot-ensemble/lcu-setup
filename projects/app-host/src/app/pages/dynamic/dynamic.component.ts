import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import {
  IoTEnsembleState,
  IoTEnsembleStateContext,
  BreakpointUtils,
  IoTEnsembleDeviceEnrollment,
  IoTEnsembleTelemetryPayload,
} from '@iot-ensemble/lcu-setup-common';
import { ColdQueryModel } from 'projects/common/src/lib/models/cold-query.model';

@Component({
  selector: 'lcu-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
})
export class DynamicComponent implements OnInit {
  //  Fields

  //  Properties
  public IsMobile: boolean;

  public State: IoTEnsembleState;

  //  Constructors
  constructor(
    protected iotEnsCtxt: IoTEnsembleStateContext,
    protected breakpointUtils: BreakpointUtils
  ) {
    this.State = {};
  }

  //  Life Cycle
  public ngOnInit(): void {
    this.breakpointUtils.SetupIsMobileObserver((result) =>
      this.handleMobileObserver(result)
    );

    this.setupStateHandler();
  }

  //  API Methods
  public ColdQuery() {
    this.State.Loading = true;

    this.iotEnsCtxt.ColdQuery();
  }

  public EnrollDevice(device: IoTEnsembleDeviceEnrollment) {
    this.State.Devices.Loading = true;

    this.iotEnsCtxt.EnrollDevice(device);
  }

  public HandleTelemetryPageEvent(event: any){
    // console.log("Telemetry Page event recieved: ", event);
    if(event.pageIndex+1 !== this.State.Telemetry.Page){
      this.UpdateTelemetryPage(event.pageIndex+1);
    }
    else if(event.pageSize !== this.State.Telemetry.PageSize){
      this.UpdateTelemetryPageSize(event.pageSize);
    }
  }

  public IssueDeviceSASToken(deviceName: string) {
    this.State.Devices.Loading = true;

    //  TODO:  Pass through expiry time in some way?
    this.iotEnsCtxt.IssueDeviceSASToken(deviceName, 0);
  }

  public Refresh(ctxt: string) {
    const loadingCtxt = this.State[ctxt] || this.State;

    loadingCtxt.Loading = true;

    this.iotEnsCtxt.$Refresh();
  }

  public RegenerateAPIKey(keyName: string) {
    // this.State.Loading = true;

    alert('Implement regenerate: ' + keyName);
    // this.iotEnsCtxt.RegenerateAPIKey(keyName);
  }

  public RevokeDeviceEnrollment(deviceId: string) {
    this.State.Devices.Loading = true;

    this.iotEnsCtxt.RevokeDeviceEnrollment(deviceId);
  }

  public SendDeviceMessage(payload: IoTEnsembleTelemetryPayload) {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.SendDeviceMessage(payload.DeviceID, payload);
  }

  public TelemetryDownload(query: ColdQueryModel){

    console.log("ColdQueryModelCall: ", query);

    if(!query.Zip){

      this.iotEnsCtxt.ColdQuery(query.StartDate, 
                                query.EndDate, 
                                query.PageSize, 
                                query.PageSize, 
                                query.SelectedDeviceIds,
                                query.IncludeEmulated,
                                query.DataType,
                                query.ResultType,
                                query.Flatten,
                                query.Zip)
      .then((obs: any) =>{
          console.log("OBS: ", obs)
          const blob = new Blob([JSON.stringify(obs.body)], { type: 'text/json' });
          const url= window.URL.createObjectURL(blob);

          let link = document.createElement("a");
          link.download = "telemetry.json";
          link.href = url;
          link.click();
    });
}
    

  }

  public ToggleTelemetryEnabled() {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.ToggleTelemetrySync();
  }

  public ToggleEmulatedEnabled() {
    this.State.Emulated.Loading = true;

    this.iotEnsCtxt.ToggleEmulatedEnabled();
  }

  public UpdateDeviceTablePageSize(pageSize: number) {
    this.State.Devices.Loading = true;

    this.iotEnsCtxt.UpdateConnectedDevicesSync(pageSize);
  }

  public UpdateTelemetryPage(page: number) {
    // console.log("calling update page: ", page)
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.UpdateTelemetrySync(
      this.State.Telemetry.RefreshRate,
      page,
      this.State.Telemetry.PageSize
    );
  }

  public UpdateTelemetryPageSize(pageSize: number) {
    // console.log("calling update pageSize: ", pageSize)
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.UpdateTelemetrySync(
      this.State.Telemetry.RefreshRate,
      this.State.Telemetry.Page,
      pageSize
    );
  }

  public UpdateRefreshRate(refreshRate: number) {
    this.State.Telemetry.Loading = true;

    this.iotEnsCtxt.UpdateTelemetrySync(
      refreshRate,
      this.State.Telemetry.Page,
      this.State.Telemetry.PageSize
    );
  }

  public WarmQuery() {
    this.State.Loading = true;

    this.iotEnsCtxt.WarmQuery(null, null, null, null, null, true);
  }

  //  Helpers
  protected handleMobileObserver(result?: BreakpointState) {
    this.IsMobile = result.matches;

    // if (!this.IsMobile && this.NavDrawer) {
    //   this.NavDrawer.open();
    // }
  }

  protected handleStateChanged() {
    console.log(this.State);
  }

  protected setupStateHandler() {
    this.iotEnsCtxt.Context.subscribe((state) => {
      this.State = Object.assign(this.State, state);

      this.handleStateChanged();
    });
  }
}
