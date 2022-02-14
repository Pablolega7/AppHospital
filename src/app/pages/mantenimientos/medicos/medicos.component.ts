import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos:Medico[] = [];
  public cargando:boolean = true;
  public imgSubs:Subscription;

  constructor( private medicoService:MedicoService, 
               private modalImagenService:ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  };

  ngOnInit(): void {

    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( () => this.cargarMedicos() );
  };

  cargarMedicos(){

    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe( medicos => {

      this.cargando = false;
      this.medicos = medicos;
    })
  };

  abrirModal(medico:Medico){

    this.modalImagenService.abrirModal('medicos',medico._id,medico.img)
  };

  buscarMedico(termino:string){

    if ( termino.length === 0 ) {
      return this.cargarMedicos();
    };

    this.medicoService.buscar('medicos',termino).subscribe( resultados => {
      console.log( resultados )
      this.medicos = resultados
    });
  };

  eliminarMedico(medico:Medico){

    this.medicoService.eliminarMedicos(medico._id).subscribe( () => {

      this.cargarMedicos();
      Swal.fire('Borrado',medico._id,'success');
    })
  };
};
