import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  role: string;
}
