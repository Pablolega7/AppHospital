import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem( 'token' ) || '';
  };

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    };
  };

  cargarHospitales(){

    const url = `${base_url}/hospitales`;
    return this.http.get(url,this.headers )
    .pipe(map(( resp: { ok:true, hospital:Hospital[] }) => resp.hospital));
  };

  crearHospitales( nombre:string ){

    const url = `${base_url}/hospitales`;
    return this.http.post( url, { nombre }, this.headers );
  };

  actualizarHospitales( _id:string, nombre:string ){

    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put( url, { nombre }, this.headers );
  };

  eliminarHospitales( _id:string ){

    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete( url, this.headers );
  };

  private transformarHospitales( resultados: any[] ): Hospital[]{

    return resultados.map(
      user => new Hospital( user.nombre, user._id, user.img )
    );
  };

  buscar ( tipo: 'usuarios' | 'medicos' | 'hospitales',
  termino: string ){

    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`
    return this.http.get<any[]>( url, this.headers )
    .pipe(
      map(( resp:any ) => {
        switch ( tipo ) {
          case 'hospitales':
            return this.transformarHospitales( resp.resultados );
            
          default:
            return[];
        };
      }),
    );
  };
};
