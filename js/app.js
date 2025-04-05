//Varibles y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos
EventListener();
function EventListener() {

document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
formulario.addEventListener('submit', agregarGasto);
}

//Clases

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restaante = Number(presupuesto);
        this.gastos = [];

   }
   nuevoGasto(gasto){
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
   }
    calcularRestante(){
     const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
     this.restaante = this.presupuesto - gastado;
        console.log(this.restaante);
    }

}

class UI {
    insertarPresupuesto(cantidad) {
        const { presupuesto, restaante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restaante;

    }

    imprimirAlerta(mensaje, tipo) {
        //crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('alert');
        divMensaje.classList.add('text-center');
        //divMensaje.classList.add('alert-' + tipo);
        //mensaje de error
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;
        //insertar en el html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //quitar la alerta despues de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }


     agregarGastosLista(gastos){
        //limpiar HTML
        this.limpiarHTML();

        gastos.forEach(gasto => {
            const { nombre, cantidad, id } = gasto;
            //crear li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> ${cantidad}</span>`;

            //boton eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnEliminar.innerHTML = 'Borrar &times;';

            btnEliminar.onclick = () => {
               this.eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnEliminar);
            gastoListado.appendChild(nuevoGasto);
        });


     }

     limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
       
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoobj) {
        const { presupuesto, restaante } = presupuestoobj;
        const restanteDiv = document.querySelector('.restante');
        //comprobar 25%
        if ((presupuesto / 4) > restaante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restaante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } 

        if (restaante <= 0) {
            this.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }

    
    eliminarGasto(id) {
        //eliminar gasto del objeto
        presupuesto.gastos = presupuesto.gastos.filter(gasto => gasto.id !== id);
        console.log(presupuesto.gastos);
        //eliminar gasto del HTML
        this.agregarGastosLista(presupuesto.gastos);

        presupuesto.calcularRestante();

        //actualizar el presupuesto restante
        this.comprobarPresupuesto(presupuesto);
        this.actualizarRestante(presupuesto.restaante);
    }

}
//intanciar
const ui = new UI();
let presupuesto
//Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
        alert('Presupuesto no válido, intenta de nuevo');
        window.location.reload();
    } else {
        console.log(presupuestoUsuario);
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);



}

//agregar gasto
function agregarGasto(e) {
    e.preventDefault();

    //leer del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar
    if (nombre === '' || cantidad === '') {
        //alert('Ambos campos son obligatorios');
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        //alert('Cantidad no válida');
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    //crear objeto gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    presupuesto.nuevoGasto(gasto);

    console.log(presupuesto.gastos);
    //
    //agregar gasto a la lista
    ui.imprimirAlerta('Gasto agregado correctamente');


    //actualizar presupuesto
    const {gastos, restaante} = presupuesto;

    ui.agregarGastosLista(gastos);
    // actualizar presupuesto
    console.log("this-->"+presupuesto.restaante);

    ui.actualizarRestante(restaante);
    
    ui.comprobarPresupuesto(presupuesto);

    //!reinicia el formulario
    formulario.reset();


}
