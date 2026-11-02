import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Tarea {
  id: number;
  texto: string;
  hecha: boolean;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  template: `
    <main>
      <h1>Mis tareas</h1>

      <div class="nueva">
        <input
          [(ngModel)]="nueva"
          (keyup.enter)="agregar()"
          placeholder="¿Qué tienes que hacer?"
          maxlength="60"
        />
        <button (click)="agregar()">Agregar</button>
      </div>
      <small>{{ nueva.length }}/60</small>

      <ul>
        @for (t of tareas(); track t.id) {
          <li [class.hecha]="t.hecha">
            <input type="checkbox" [checked]="t.hecha" (change)="alternar(t.id)" />
            <span>{{ t.texto }}</span>
            <button (click)="eliminar(t.id)">✕</button>
          </li>
        } @empty {
          <p class="vacio">No hay tareas todavía 🎉</p>
        }
      </ul>

      <p>Pendientes: {{ pendientes() }}</p>
    </main>
  `,
  styles: [`
    main { max-width: 420px; margin: 3rem auto; padding: 0 1rem; font-family: sans-serif; }
    .nueva { display: flex; gap: .5rem; }
    .nueva input { flex: 1; padding: .5rem; }
    small { color: #999; }
    ul { list-style: none; padding: 0; }
    li { display: flex; gap: .5rem; align-items: flex-start; padding: .4rem 0; border-bottom: 1px solid #eee; }
    li span { overflow-wrap: anywhere; word-break: break-word; }
    li.hecha span { text-decoration: line-through; color: #999; }
    .vacio { color: #999; }
  `]
})
export class App {
  nueva = '';
  tareas = signal<Tarea[]>([]);
  pendientes = computed(() => this.tareas().filter(t => !t.hecha).length);

  agregar() {
    const texto = this.nueva.trim();
    if (!texto) return;
    this.tareas.update(lista => [...lista, { id: Date.now(), texto, hecha: false }]);
    this.nueva = '';
  }

  alternar(id: number) {
    this.tareas.update(lista =>
      lista.map(t => (t.id === id ? { ...t, hecha: !t.hecha } : t))
    );
  }

  eliminar(id: number) {
    this.tareas.update(lista => lista.filter(t => t.id !== id));
  }
}