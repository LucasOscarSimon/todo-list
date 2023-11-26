export default class Task {

    id: number | null;
    name: string;
    description: string;

    constructor(id: number | null, name: string, description: string) {

        this.id = id;
        this.name = name;
        this.description = description;
        
    }
}