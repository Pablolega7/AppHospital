import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico( id ));

    this.cargarHospitales();
    this.medicoForm = this.fb.group({
      nombre: [ '', Validators.required ],
      hospital: [ '', Validators.required ]
    })
    this.medicoForm.get( 'hospital' ).valueChanges
    .subscribe( hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
    })
  };

  cargarHospitales(){

    this.hospitalService.cargarHospitales().subscribe(( hospitales:Hospital[] ) => {
      this.hospitales = hospitales;
    })
  };

  cargarMedico( id:string ){
    if ( id === "nuevo" ) {
      return;
    }
    this.medicoService.obtenerMedicoById( id )
    .pipe(delay( 100 )
    )
    .subscribe( medico => {

        // if (!medico.hospital) return;

        if ( !medico ) {
          return this.router.navigateByUrl( `/dashboard/medicos` )
        }
        // const{nombre,hospital:{_id}}=medico;
        const{ nombre, hospital:{_id} } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue( { nombre, hospital:_id } );
      }); 
    };

  guardarMedico(){

    const { nombre } = this.medicoForm.value;

    if ( this.medicoSeleccionado ) {

      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      };

      this.medicoService.actualizarMedicos( data ).subscribe( () => {
        Swal.fire( 'Actualizado', `${nombre} Actualizado Correctamente`, 'success');
      });
    }
     else {

      this.medicoService.crearMedicos( this.medicoForm.value ).subscribe(( resp:any )=>{
        Swal.fire( 'Creado', `${nombre} Creado Correctamente`, 'success');
        this.router.navigateByUrl( `/dashboard/medico/${resp.medico._id}` )
      }) 
    }
  };
};
