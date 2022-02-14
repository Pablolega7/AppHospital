import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  cargarMedicos(){

    const url = `${base_url}/medicos`;
    return this.http.get (url, this.headers )
    .pipe(map(( resp:{ ok: true, medicos: Medico[] }) => resp.medicos ));
  };

  obtenerMedicoById( id: string ){

    const url = `${base_url}/medicos/${id}`;
    return this.http.get( url, this.headers)
    .pipe(map(( resp: { ok: true, medico: Medico }) => resp.medico ));
  };

  crearMedicos( medico: { nombre: string, hospital: string } ){

    const url = `${base_url}/medicos`;
    return this.http.post( url, medico, this.headers );
  };

  actualizarMedicos( medico: Medico ){

    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put( url, medico, this.headers );
  };

  eliminarMedicos( _id: string ){

    const url = `${base_url}/medicos/${_id}`;
    return this.http.delete( url, this.headers );
  };

  private transformarMedicos( resultados: any[] ): Medico[]{

    return resultados;
  };

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales',
  termino: string ){

    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`
    return this.http.get<any[]>( url, this.headers )
    .pipe(
      map(( resp: any ) => {
        switch ( tipo ) {
          case 'medicos':
            return this.transformarMedicos( resp.resultados );
            
          default:
            return[];
        };
      }),
    );
  };
};
