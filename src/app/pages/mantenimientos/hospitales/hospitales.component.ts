import { Component, OnDestroy, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospital: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;
  public hospitalesTemp: Hospital[] = [];

  constructor(private hospitalService:HospitalService, private modalImagenService:ModalImagenService) { }

  ngOnDestroy(): void {

   this.imgSubs.unsubscribe();
  };

  ngOnInit(): void {

    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay( 100 )
    )
    .subscribe( () => this.cargarHospitales() );
  };

  cargarHospitales(){

    this.cargando = true;

    this.hospitalService.cargarHospitales().subscribe(hospital => {
      this.cargando = false;
      this.hospital = hospital;
      this.hospitalesTemp = hospital;
    })
  };

  guardarCambios(hospital:Hospital){

    this.hospitalService.actualizarHospitales( hospital._id, hospital.nombre ).subscribe(() => {
      Swal.fire( 'Actualizado', hospital.nombre, 'success' )
    })
  };

  eliminarHospital(hospital:Hospital){

    this.hospitalService.eliminarHospitales( hospital._id ).subscribe(resp => {
      this.cargarHospitales();
      Swal.fire( 'Borrado', hospital._id, 'success' );
    })
  };

   async abrirSweetAlert(){

    const { value = "" } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el Nombre del Nuevo Hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
    })
    if ( value.trim().length > 0 ) {
      return this.hospitalService.crearHospitales( value ).subscribe(() => {
        this.cargarHospitales();
      })
    }
  };

  abrirModal(hospital:Hospital){

    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img )
  };

  buscarHospital(termino:string){

    if (termino.length === 0) {
      return this.hospital = this.hospitalesTemp;
    };

    this.hospitalService.buscar( 'hospitales', termino ).subscribe(resultados => {
      this.hospital = resultados
    })
  };
};
