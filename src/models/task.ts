export default class Tarea {

    id: number | null;
    nombre: string;
    descripcion: string;

    constructor(id: number | null, nombre: string, descripcion: string) {

        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        
    }
}