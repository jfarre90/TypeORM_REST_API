import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class Hero {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

}
