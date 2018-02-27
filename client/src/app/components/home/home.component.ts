import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    cities;
    ioConnection: any;
    chart = [];

    constructor(private socketService: SocketService) { }

    ngOnInit() {
        this.initIoConnection();
    }

    private initIoConnection(): void {
        this.socketService.initSocket();
        this.socketService.getCities()
            .then(data => {
                console.log(data);
                this.cities = data;
            })
            .catch(error => console.log(error));

        this.ioConnection = this.socketService.onChange()
            .subscribe((data) => {
                this.cities = data;

                let chart_labels = [];
                let chart_data = [];
                let i = 0;
                this.cities.forEach((city) => {
                    chart_labels.push(city.NAME);
                    chart_data.push(city.VOTES);
                });

                this.chart = new Chart('canvas', {
                    type: 'bar',
                    data: {
                        labels: chart_labels,
                        datasets: [
                            {
                                label: 'votos',
                                data: chart_data,
                                borderColor: "#3cba9f",
                                fill: false
                            }]
                    }
                });
                //console.log("labels: ", chart_labels)
            })
    }
    /*
    this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: weatherDates,
          datasets: [
            { 
              data: temp_max,
              borderColor: "#3cba9f",
              fill: false
            },
            { 
              data: temp_min,
              borderColor: "#ffcc00",
              fill: false
            },
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
});*/


    postVote(city_id) {
        this.socketService.putVote(city_id)
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }


}
