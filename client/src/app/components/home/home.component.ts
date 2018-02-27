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
                //this.cities = data; //COMENTAR O DESCOMENTAR ESTO
                this.cities[9].VOTES += 1; //COMENTAR O DESCOMENTAR ESTO

                let chart_labels = [];
                let chart_data = [];
                let i = 0;
                this.cities.forEach((city) => {
                    chart_labels.push(city.NAME);
                    chart_data.push(city.VOTES);
                });

                //ACA EN LO DE ABAJO SE REEMPLAZA TODO EL GRAFICO
                this.chart = new Chart('canvas', {
                    type: 'bar',
                    data: {
                        labels: chart_labels,
                        datasets: [
                            {
                                label: 'Nombre de la Ciudad, País',
                                data: chart_data,
                                backgroundColor: [
                                    '#f44336',
                                    '#9c27b0',
                                    '#3f51b5',
                                    '#03a9f4',
                                    '#4caf50',
                                    '#ffc107',
                                    '#cddc39',
                                    '#ff5722',
                                    '#607d8b',
                                    '#e91e63',
                                ],
                                borderColor: "#3cba9f",
                                fill: false
                            }]
                    },
                    options: {
                        legend: {
                            display: true,
                            position: 'right'
                        },
                        scales: {
                            xAxes: [{
                                display: false
                            }],
                            yAxes: [{
                                display: true
                            }],
                        }
                    }
                });

            })
    }

    postVote(city_id) {
        this.socketService.putVote(city_id)
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }


}
/*
'#f44336', red
'#9c27b0', purple
'#3f51b5', indigo
'#03a9f4', Light Blue
'#4caf50', green
'#ffc107', amber
'#cddc39', lime
'#ff5722', deeporange
'#607d8b', bluegray
'#e91e63', pinnk
'#673ab7', deeppurpel
'#00bcd4', cyan
'#8bc34a', lighgreen
'#ffeb3b', yellow
'#ff9800', orange
'#9e9e9e', gray
'#2196f3', blue
'#009688', teal
'#795548'
*/
