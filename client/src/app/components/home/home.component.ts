import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    cities;
    ioConnection: any;
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
            });
    }

    postVote(city_id) {
        this.socketService.putVote(city_id)
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }


}
