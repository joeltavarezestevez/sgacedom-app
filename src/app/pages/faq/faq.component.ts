import { Component, OnInit } from '@angular/core';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, SgHeaderComponent]  
})
export class FaqComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  faqs = [
    {
      pregunta: '¿Cómo puedo obtener mi número de socio?',
      respuesta: 'Debe dirigirse a la oficina más cercana de SGACEDOM y afiliarse. Solo los socios tienen acceso al CICSS y sus beneficios.'
    },
    {
      pregunta: '¿Cómo puedo cambiar mi contraseña?',
      respuesta: 'Ingrese a la sección de configuración desde el menú superior. Coloque su contraseña actual, luego su nueva contraseña dos veces, y presione "Actualizar".'
    },
    {
      pregunta: '¿Cómo puedo hacer una reclamación?',
      respuesta: 'Vaya al menú de "Reclamaciones" y seleccione "Realizar Reclamación". Llene el formulario y un operador evaluará su caso.'
    },
    {
      pregunta: '¿Cómo puedo saber el estado de mi reclamación?',
      respuesta: 'Ingrese al menú "Reclamaciones" y seleccione "Listado de Reclamaciones" para verificar el estado de su caso.'
    },
    {
      pregunta: '¿Cómo registro mi obra?',
      respuesta: 'Seleccione "Registra tu Obra" desde el menú y complete el formulario. Toda la información será verificada por el personal.'
    },
    {
      pregunta: '¿Cómo sé cuándo mi obra fue aceptada?',
      respuesta: 'Vaya a "Listado de Obras" para consultar el estado de su obra registrada.'
    },
    {
      pregunta: '¿Cómo me puedo poner en contacto con algún operador?',
      respuesta: 'Puede ir al menú "Soporte", escribir en el chat o llamar al 809-689-6132 Ext. 233.'
    },
    {
      pregunta: '¿Cómo veo el registro de los repartos anteriores?',
      respuesta: 'Desde el menú de "Listado de Repartos" podrá consultar todos los repartos realizados anteriormente.'
    },
  ];
}

