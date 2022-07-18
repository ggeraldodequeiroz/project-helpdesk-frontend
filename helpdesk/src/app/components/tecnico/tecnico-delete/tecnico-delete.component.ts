import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-delete',
  templateUrl: './tecnico-delete.component.html',
  styleUrls: ['./tecnico-delete.component.css']
})
export class TecnicoDeleteComponent implements OnInit {

  tecnico: Tecnico = {
    id:         '',
    nome:       '',
    cpf:        '',
    email:      '',
    senha:      '',
    perfis:     [],
    dataCriacao: ''
  }
  
  isAdmin: boolean = false;
  isCliente: boolean = false;
  isTecnico: boolean = false;

  constructor(
    private service: TecnicoService,
    private toast:    ToastrService,
    private router:          Router,
    private route:   ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
   }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe(resposta => {
      for(let i=0; i<=2; i++) {
        if(resposta.perfis[i] == 'ADMIN')
          this.isAdmin = true;
        if(resposta.perfis[i] == 'CLIENTE')
          this.isCliente = true;
        if(resposta.perfis[i] == 'TECNICO')
          this.isTecnico = true;
      }
      resposta.perfis = []
      this.tecnico = resposta;
    })
  }

  delete(): void {
    this.service.delete(this.tecnico.id).subscribe(() => {
      this.toast.success('Técnico deletado com sucesso', 'Delete');
      this.router.navigate(['tecnicos'])
    }, ex => {
      if(ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      } else {
        this.toast.error(ex.error.message);
      }
    })
  }

}
