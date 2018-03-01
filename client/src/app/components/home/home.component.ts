import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @ViewChild("baseChart") chart: BaseChartDirective;
    cities;
    ioConnection: any;

    //NUEVO
    barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
            display: true,
            position: 'right'
        },
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    ready = false;

    barChartLabels: string[] = []; //VACIO??
    barChartType: string = 'bar';
    barChartLegend: boolean = true;

    barChartData: any[] = [];
    lineChartColors: Array<any> = [];
    //FIN NUEVO

    city_changes = [];
    change_votes = [];

    colors = [
        '#f44336', //red
        '#9c27b0', //purple
        '#3f51b5', //indigo
        '#03a9f4', //light_blue
        '#4caf50', //green
        '#ffc107', //amber
        '#cddc39', //lime
        '#ff5722', //deep_orange
        '#607d8b', //blue_gray
        '#e91e63', //pink
        '#673ab7', //deep_purple
        '#00bcd4', //cyan
        '#8bc34a', //lightgreen
        '#ffeb3b', //yellow
        '#ff9800', //orange
        '#9e9e9e', //gray
        '#2196f3', //blue
        '#009688', //teal
        '#795548'
    ];

    set_colors = [];


    constructor(private socketService: SocketService) { }

    ngOnInit() {
        this.initIoConnection();
    }

    private initIoConnection(): void {
        this.socketService.initSocket();
        this.socketService.getCities()
            .then(data => {
                this.cities = data;

                for (let i = 0; i < data.length; i++) {
                    let object_city = { data: [this.cities[i].VOTES], label: this.cities[i].NAME };
                    this.barChartData.push(object_city);

                    let object_property = { backgroundColor: this.colors[i], borderColor: this.colors[i] };
                    this.lineChartColors.push(object_property);

                    let object_color = { id: this.cities[i].ID, color: this.colors[i] };
                    this.set_colors.push(object_color);

                    if (i == 9) this.ready = true;
                }
                console.log("chocho: ", this.barChartData);
                console.log("cheche: ", this.set_colors);
                /*
                this.cities.forEach((city) => {
                    this.barChartLabels.push(city.NAME);
                    this.barChartData[0].data.push(city.VOTES);
                });*/

                //this.barChartLabels.push(this.cities[0].NAME);
                //this.barChartLabels.push('votos');
                //this.barChartData[0].data.push(this.cities[0].VOTES);
                //this.barChartData[0].label = 'chorizo';

                //this.barChartLabels.push('votos');
                //this.barChartData[1].data.push(this.cities[1].VOTES);
                //this.barChartData[1].label = 'vianesa';

                //console.log("barchardata: ", this.barChartData);
                //console.log("votos de la ultima ciudad", this.barChartData[0].data[9])
            })
            .catch(error => console.log(error));

        this.ioConnection = this.socketService.onChange()
            .subscribe((response) => {

                let clone = JSON.parse(JSON.stringify(this.barChartData));

                for (let i = 0; i < response.length; i++) {

                    //ALMACENA QUE CIUDADES CAMBIARON DE POSICION
                    if (this.cities[i].ID != response[i].ID) {
                        this.city_changes.push(this.cities[i]);
                    }

                    for (let j = 0; j < response.length; j++) {
                        if ((this.cities[i].ID == response[j].ID) && (this.cities[i].VOTES != response[j].VOTES)) {
                            clone[i].data[0] = response[j].VOTES
                        }
                    }





                    //let object_city = { data: [this.cities[i].VOTES], label: this.cities[i].NAME };
                    //BUSCAR DONDE MIERDA ESTA EL OBJETO
                    //NO PUEDO ELIMINAR UN OBJETO PORQUE DESPUES BUSCARE EL ID   
                }
                this.barChartData = clone;
                //this.cities = response;
                console.log("cambios: ", this.city_changes);
                console.log("cambios: ", this.change_votes);


                //ANIMACION SUBIENDO VOTOS DE LA ULTIMA BARRA (FUNCIONA)
                //let clone = JSON.parse(JSON.stringify(this.barChartData));
                //clone[9].data[0] += 1;
                //this.barChartData = clone;

                //CAMBIO DE LABEL EN LA BARRA (FUNCIONA)
                //let clone = JSON.parse(JSON.stringify(this.barChartData));
                //clone[9].label = 'Arica';
                //this.barChartData = clone;

                //CAMBIO DE COLOR (FUNCIONA PERO TODAS LAS BARRRAS SE VUELVEN A GENERAR)
                //let clone = JSON.parse(JSON.stringify(this.lineChartColors));
                //clone[9].backgroundColor = '#f44336';
                //this.lineChartColors = clone;



                //ELIMINANDO UNA BARRA (DATASET)

                /*
                let clone = JSON.parse(JSON.stringify(this.barChartData));
                clone.shift();
                this.barChartData = clone;
                
                

                //VUELVE A RECONSTRUIR TODO GRÁFICO
                if (this.chart !== undefined) {
                    this.chart.chart.destroy();
                    this.chart.chart = 0;
             
                    this.chart.datasets = this.barChartData;
                    this.chart.labels = this.barChartLabels;
                    this.chart.ngOnInit();
                 }



                 */
                /*
                if(this.chart !== undefined){
                    this.chart.ngOnDestroy();
                    this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
                }*/

                //ELIMINANDO UNA BARRA (DATASET)
                //console.log("bardata: ", this.barChartData);
                //let object_city = [{ data: [5], label: 'Arica' }];
                //console.log("clone: ", JSON.parse(JSON.stringify(this.barChartData)));
                //this.barChartData = object_city;
                //clone.push(object_city);
                //let clone = JSON.parse(JSON.stringify(object_city));
                //this.barChartData=clone;
                //console.log("clun: ", clone);
                //this.barChartData = JSON.parse(JSON.stringify(clone));



                //let temp1 = this.barChartData[0];
                //this.barChartData[0] = this.barChartData[1];
                //this.barChartData[1] = temp1;

                /*
                //CAMBIO COLOR
                let temp2 = JSON.parse(JSON.stringify(this.lineChartColors[0]));
                this.lineChartColors[0] = JSON.parse(JSON.stringify(this.lineChartColors[1]));
                this.lineChartColors[1] = temp2;

                console.log("charcolor ini: ", this.lineChartColors);
                let tem2 = JSON.parse(JSON.stringify(this.lineChartColors));
                tem2[0] = { backgroundColor: '#4caf50', borderColor: '#4caf50' };
                this.lineChartColors = tem2;
                console.log("charcolor end: ", this.lineChartColors);
                this.chart.chart.update();

                */


                //console.log(this.lineChartColors);

                //response.map(city=> {
                //    console.log("ciudad: ", city);
                //})

                /*this.cities = response; //COMENTAR O DESCOMENTAR ESTO
                
                
                let data = []
                this.cities.forEach((city) => {
                    data.push(city.VOTES);
                });
                console.log("votos response: ", data);

                let clone = JSON.parse(JSON.stringify(this.barChartData));
                clone[0].data = data;
                this.barChartData = clone;
                */




                /*
                let clone = JSON.parse(JSON.stringify(this.barChartData));
                console.log("clone: ", clone);
                let data_clone = clone[0].data; // TENGO [{data: }]
                console.log("data_clone: ", data_clone);
                data_clone[9]+=1;
                clone[0]=data_clone;
                console.log("clone: ", clone)
                this.barChartData = clone;*/
                //this.barChartData[0].data[9]+=1;
                //this.cities[9].VOTES += 1; //COMENTAR O DESCOMENTAR ESTO


                //let chart_labels = [];
                //let chart_data = [];

                //NUEVO




                //VIEJO
                /*this.cities.forEach((city) => {
                    chart_labels.push(city.NAME);
                    chart_data.push(city.VOTES);
                });*/

                //ACA EN LO DE ABAJO SE REEMPLAZA TODO EL GRAFICO
                /*
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
                */
            })
    }

    postVote(city_id) {
        this.socketService.putVote(city_id)
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }


}

