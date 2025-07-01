import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // --- Relacionamento One-to-Many com Product ---
  // Uma categoria pode ter muitos produtos (OneToMany)
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
// --- Fim do relacionamento One-to-Many com Product ---
