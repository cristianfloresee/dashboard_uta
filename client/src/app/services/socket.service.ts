import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//OBSERVABLES
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
//MODELOS
import { City } from '../models/city';
//SOCKET.IO
import * as io from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000';


@Injectable()
export class SocketService {
    private socket;

    constructor(private client: HttpClient) { }

    public initSocket(): void {
        this.socket = io(SERVER_URL);
    }

    public getCities(): Promise<Array<City>> {
        return this.client
            .get<City[]>(`${SERVER_URL}/api/super-cities`)
            .toPromise()
            .then((response) => {
                return response as City[];
            })
            .catch(this.handleError);
    }

    public putVote(city_id): Promise<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json');

        return this.client
            .put(`${SERVER_URL}/api/vote`, JSON.stringify({ ID: city_id }), { headers: headers })
            .toPromise()
            .then((data) => JSON.stringify(data))
            .catch(this.handleError);
    }

    public onChange(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('change', (data) => observer.next(data));
        });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }



}
