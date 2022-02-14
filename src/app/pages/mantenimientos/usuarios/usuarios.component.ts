import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios:number = 0;
  public usuarios:Usuario[] = [];
  public usuariosTemp:Usuario[] = [];
  public desde:number = 0;
  public cargando:boolean = true;
  public imgSubs:Subscription

  constructor( private usuarioService:UsuarioService, 
               private busquedasService:BusquedasService,
               private modalImagenService:ModalImagenService ) { }
  
  ngOnDestroy(): void {
    
    this.imgSubs.unsubscribe();
  };

  ngOnInit(): void {

    this.cargarUsuarios();
   this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( () => this.cargarUsuarios() );
  };

  cargarUsuarios(){
    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.desde).subscribe(({ total,usuarios }) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    })
  };

  cambiarPagina(valor:number){

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0  
    } else if ( this.desde >= this.totalUsuarios ) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  };

  buscar(termino:string){

    if (termino.length === 0) {
      return this.usuarios=this.usuariosTemp;
    }

    this.busquedasService.buscar( 'usuarios',termino ).subscribe( resultados => {
      this.usuarios = resultados });
  };

  eliminarUsuario(usuario:Usuario){

    if (usuario.uid === this.usuarioService.uid) {
      
      return Swal.fire('Error','No Puede Borrarse a si Mismo','error');
    };

    Swal.fire({

      title: '¿Borrar Usuario?',
      text: `Esta a punto de Borrar ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar Usuario!'

    }).then((result) => {
      if ( result.value ) {
        this.usuarioService.eliminarUsuario( usuario ).subscribe( resp => {
          this.cargarUsuarios();
          Swal.fire(
            'usuario Borrado',
            `${usuario.nombre} Fue Eliminado Correctamente`,
            'success'
          )
        } 
        );
      };
    });
  };

  cambiarRole(usuario:Usuario){

    this.usuarioService.guardarUsuario(usuario)
    .subscribe(resp => {
      console.log( resp );
    })
  };

  abrirModal(usuario:Usuario){
    
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  };
};
